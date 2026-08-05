#!/usr/bin/env node

import { spawn } from "node:child_process";

const packageName = "illustrator-mcp-server@1.5.2";
const requiredTools = [
  "list_fonts",
  "create_document",
  "get_document_structure",
  "create_text_frame",
  "create_path",
  "manage_layers",
  "save_document",
  "export",
  "export_pdf",
  "preflight_check",
];
const requestedFontFilters = process.argv.slice(2);
const fontFilters = requestedFontFilters.length > 0
  ? requestedFontFilters
  : ["ArialMT", "SimSun", "宋体"];

const isWindows = process.platform === "win32";
const command = isWindows ? (process.env.ComSpec ?? "cmd.exe") : "npx";
const commandArgs = isWindows
  ? ["/d", "/s", "/c", `npx -y ${packageName}`]
  : ["-y", packageName];
const child = spawn(command, commandArgs, {
  stdio: ["pipe", "pipe", "pipe"],
  windowsHide: true,
});

let nextId = 1;
let stdoutBuffer = "";
let stderr = "";
const pending = new Map();

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

function request(method, params = {}, timeoutMs = 120_000) {
  const id = nextId++;
  send({ jsonrpc: "2.0", id, method, params });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${method} timed out after ${timeoutMs} ms`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
  });
}

function handleLine(line) {
  if (!line.trim()) return;

  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }

  const waiter = pending.get(message.id);
  if (!waiter) return;

  clearTimeout(waiter.timer);
  pending.delete(message.id);
  if (message.error) {
    waiter.reject(new Error(JSON.stringify(message.error)));
  } else {
    waiter.resolve(message.result);
  }
}

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  stdoutBuffer += chunk;
  const lines = stdoutBuffer.split(/\r?\n/);
  stdoutBuffer = lines.pop() ?? "";
  lines.forEach(handleLine);
});

child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => {
  stderr += chunk;
});

child.on("error", (error) => {
  for (const waiter of pending.values()) {
    clearTimeout(waiter.timer);
    waiter.reject(error);
  }
  pending.clear();
});

function parseToolText(result) {
  const text = result?.content
    ?.filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  try {
    const initialized = await request("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "illustrator-plugin-smoke-test", version: "0.1.0" },
    });
    send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

    const toolList = await request("tools/list");
    const toolNames = new Set(toolList.tools.map((tool) => tool.name));
    const missingTools = requiredTools.filter((name) => !toolNames.has(name));

    const fonts = [];
    for (const filter of fontFilters) {
      const result = await request("tools/call", {
        name: "list_fonts",
        arguments: { filter, limit: 50 },
      });
      fonts.push({
        filter,
        isError: Boolean(result?.isError),
        result: parseToolText(result),
      });
    }

    const availablePostScriptNames = new Set(fonts.flatMap(({ result, isError }) =>
      isError || !Array.isArray(result?.fonts)
        ? []
        : result.fonts.map((font) => font.name)));
    const arialAvailable = availablePostScriptNames.has("ArialMT");
    const simSunAvailable = availablePostScriptNames.has("SimSun");

    console.log(JSON.stringify({
      requestedPackage: packageName,
      serverInfo: initialized.serverInfo,
      protocolVersion: initialized.protocolVersion,
      toolCount: toolNames.size,
      requiredToolsPresent: missingTools.length === 0,
      missingTools,
      fontGate: {
        passed: arialAvailable && simSunAvailable,
        arialAvailable,
        simSunAvailable,
        requiredPostScriptNames: {
          chinese: "SimSun",
          english: "ArialMT",
        },
        blockingReason: arialAvailable && simSunAvailable
          ? null
          : "Do not create text until Illustrator exposes the exact PostScript names SimSun and ArialMT.",
      },
      fonts,
    }, null, 2));

    process.exitCode = missingTools.length === 0 ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({
      error: error.message,
      serverStderr: stderr.trim(),
    }, null, 2));
    process.exitCode = 1;
  } finally {
    child.stdin.end();
    child.kill();
  }
}

await main();
