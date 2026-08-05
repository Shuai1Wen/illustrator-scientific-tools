# Illustrator Scientific Tools

Codex plugin for creating, inspecting, refining, preflighting, and exporting editable scientific figures directly in Adobe Illustrator.

## Runtime

- Adobe Illustrator with Windows COM automation support
- Node.js 20 or later
- `illustrator-mcp-server@1.5.2`, pinned in `.mcp.json`
- `SimSun` and `ArialMT` visible to Illustrator

The plugin uses the stable typed MCP surface. It does not require an Adobe Beta API and does not use mouse or keyboard automation.

## Scientific figure policy

- Keep the editable `.ai` document as the source of truth.
- Use named layers and semantically named objects.
- Use exact PostScript name `SimSun` for Chinese 宋体 and `ArialMT` for English.
- Use exactly three positive integer font sizes; the default is 18/14/10 pt.
- Review each logical stage with a PNG export.
- Run Illustrator preflight before final delivery.
- Preserve live text unless the user explicitly requests outlined delivery copies.

## Runtime smoke test

From the plugin root:

```powershell
node scripts/runtime-smoke-test.mjs
```

The test only initializes the MCP server, checks required tool names, and queries Illustrator fonts. It does not create or mutate a document.

If localized Illustrator creates `<basename>_<artboard-name>.svg` and the MCP reports a false negative, normalize the validated derivative without touching the AI master:

```powershell
node scripts/normalize-svg-export.mjs C:\absolute\path\expected.svg
```

The font gate uses exact PostScript-name matching. `NSimSun`, SimSun extension fonts, Adobe Song, and Arial variants do not pass as automatic substitutes.

## Known upstream metadata issue

The pinned npm package is `illustrator-mcp-server@1.5.2`, while its MCP `serverInfo.version` currently reports `1.2.4`. Runtime validation therefore records both values.
