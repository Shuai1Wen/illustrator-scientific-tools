#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const expectedPath = process.argv[2];
const maxAgeSeconds = Number(process.argv[3] ?? 180);

if (!expectedPath || !path.isAbsolute(expectedPath)) {
  throw new Error("Usage: node normalize-svg-export.mjs <absolute-expected.svg> [max-age-seconds]");
}
if (path.extname(expectedPath).toLowerCase() !== ".svg") {
  throw new Error("The expected output must use the .svg extension.");
}
if (!Number.isFinite(maxAgeSeconds) || maxAgeSeconds <= 0) {
  throw new Error("max-age-seconds must be a positive number.");
}

function inspectSvg(filePath) {
  const contents = fs.readFileSync(filePath, "utf8");
  if (!/<svg(?:\s|>)/i.test(contents)) {
    throw new Error(`Export candidate is not a valid SVG document: ${filePath}`);
  }
  const viewBox = contents.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  return { bytes: Buffer.byteLength(contents), viewBox };
}

const outputDirectory = path.dirname(expectedPath);
const expectedName = path.basename(expectedPath, ".svg");

if (fs.existsSync(expectedPath)) {
  console.log(JSON.stringify({
    status: "already-exists",
    outputPath: expectedPath,
    ...inspectSvg(expectedPath),
  }, null, 2));
  process.exit(0);
}

const now = Date.now();
const candidates = fs.readdirSync(outputDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .filter((entry) => entry.name.toLowerCase().endsWith(".svg"))
  .filter((entry) => entry.name.startsWith(`${expectedName}_`))
  .map((entry) => {
    const filePath = path.join(outputDirectory, entry.name);
    const stats = fs.statSync(filePath);
    return { filePath, mtimeMs: stats.mtimeMs };
  })
  .filter(({ mtimeMs }) => now - mtimeMs <= maxAgeSeconds * 1000)
  .sort((a, b) => b.mtimeMs - a.mtimeMs);

if (candidates.length === 0) {
  throw new Error(`No recent localized artboard SVG matches ${expectedName}_*.svg`);
}

const sourcePath = candidates[0].filePath;
const inspection = inspectSvg(sourcePath);
fs.renameSync(sourcePath, expectedPath);

console.log(JSON.stringify({
  status: "normalized",
  sourcePath,
  outputPath: expectedPath,
  candidateCount: candidates.length,
  ...inspection,
}, null, 2));
