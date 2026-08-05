---
name: create-scientific-figure-in-illustrator
description: Create, recreate, inspect, revise, preflight, and export editable scientific figures directly inside the visible Adobe Illustrator desktop application through the Illustrator MCP server. Use for native .ai scientific schematics, reference-image reconstruction, journal figure refinement, vector typography cleanup, layered Illustrator delivery, or SVG/PDF/PNG export from Illustrator.
---

# Create Scientific Figures in Adobe Illustrator

Use the plugin MCP tools whose names end in `set_illustrator_version`, `list_fonts`, `open_document`, `create_document`, `get_document_info`, `get_document_structure`, `get_artboards`, `get_layers`, `create_rectangle`, `create_ellipse`, `create_line`, `create_path`, `create_text_frame`, `create_path_text`, `create_gradient`, `place_image`, `import_svg_as_editable`, `manage_layers`, `group_objects`, `move_to_layer`, `set_z_order`, `modify_object`, `find_objects`, `list_text_frames`, `get_text_frame_detail`, `undo`, `save_document`, `export`, `export_pdf`, and `preflight_check`.

Read [tool-routing.md](references/tool-routing.md) before the first MCP call. Read [scientific-figure-standard.md](references/scientific-figure-standard.md) before creating or restyling artwork. Read [font-gate.md](references/font-gate.md) when resolving or diagnosing fonts. Read [preflight-and-delivery.md](references/preflight-and-delivery.md) before final saving or export.

For connection diagnostics only, run `node ../../../scripts/runtime-smoke-test.mjs` from this skill directory. The script is read-only: it validates the pinned MCP package, required tools, and all required Illustrator font aliases. Do not use it as a drawing backend.

## Hard boundary

- Work through the Illustrator MCP tools and Illustrator's object model only. Do not use operating-system mouse, keyboard, window, or screen automation.
- Do not fabricate or patch `.ai` files with filesystem code. Create and save native Illustrator documents only through Illustrator.
- Do not use a Beta-only interface. Use the pinned stable-version MCP supplied by this plugin.
- Do not fall back to arbitrary ExtendScript, shell injection, Flue, or another bridge when a typed MCP tool is unavailable. Report the missing operation instead.
- Treat Illustrator as the visible source of truth. Read the active document and returned object UUIDs before subsequent edits.

## Safety gates

- Inspect before mutation. For an existing document, call `get_document_info` and `get_document_structure` first.
- Before changing an existing source file, use `save_document` with `mode="save_as"` and an explicit new absolute `.ai` path. Never overwrite the user's original unless explicitly requested.
- Before creating any text, call `list_fonts` and require the exact Illustrator PostScript names `SimSun` for Chinese 宋体 and `ArialMT` for English. Apply the exact-match rules in [font-gate.md](references/font-gate.md). If either required font is unavailable, stop before text creation and report the missing font.
- Treat any `font_warning`, font candidate fallback, partial failure, or failed verification as an error. Call `undo` when the failed action changed the document.
- Never call layer deletion, object deletion, document close, bulk outline conversion, or source overwrite unless the user explicitly requested that exact destructive action.
- Keep editable master text live. Create an outlined derivative only after saving the editable `.ai` master, and never replace the master with the outlined copy.

## Workflow

1. Inspect every supplied reference with vision before operating Illustrator. Render the relevant PDF page first. Identify canvas dimensions, panels, vector primitives, raster-only content, labels, arrows, legends, colors, line weights, and z-order.
2. Establish the Illustrator session. Use automatic stable-version detection unless the user names a version; call `set_illustrator_version` only when selection is necessary. Use absolute paths for every input and output.
3. Pass the font gate. Query `SimSun`, `宋体`, and `ArialMT` with `list_fonts`, require exact PostScript-name matches, and define exactly three positive integer font sizes. Default to 18/14/10 pt for large/medium/small text. If either font is missing, create no text; continue only with an explicitly identified geometry-only preview and block labeled final delivery.
4. Open or create the document. Use `open_document` for an existing `.ai`, `.svg`, `.pdf`, or `.eps`; use `create_document` with explicit width, height, and RGB/CMYK mode for a new figure. Use `coordinate_system="artboard-web"` for geometry operations.
5. Save a working `.ai` copy before edits. For a new unsaved document, save it immediately to the intended working path. Confirm the returned path.
6. Inspect document metadata, artboards, layers, and structure. Create the standard layers from [scientific-figure-standard.md](references/scientific-figure-standard.md), preserving any meaningful existing layers.
7. Build one logical section at a time with typed creation tools. Give every important object a stable semantic `name`, capture its returned UUID, and use that UUID for modification, grouping, layer moves, and z-order changes.
8. Keep text editable. Use `SimSun` for Chinese and `ArialMT` for English. Split mixed Chinese-English labels into aligned text objects by script. Use only the three declared integer sizes.
9. After each panel or logical section, export the affected artboard as a non-destructive PNG review image. Inspect it with vision for scientific meaning, topology, text, overlap, clipping, alignment, whitespace, line weight, and correspondence to the reference. Correct issues through MCP tools and re-export.
10. Re-read document structure and text details after major edits. Verify returned bounds and object counts rather than assuming an operation succeeded.
11. Save the editable `.ai` master, run the checks in [preflight-and-delivery.md](references/preflight-and-delivery.md), fix material findings, save again, and export the requested deliverables. Verify each requested output exists. If localized Illustrator appends an artboard suffix to SVG, follow the normalization procedure in [tool-routing.md](references/tool-routing.md).

## Required quality rules

- Preserve scientific meaning before decoration: labels, directionality, grouping, panel order, legends, and quantitative encodings must be correct.
- Create text as Illustrator text, arrows and strokes as vector paths, and repeated motifs as named groups or symbols where practical.
- Keep geometry on a consistent coordinate grid unless faithful reconstruction requires finer placement.
- Use consistent stroke widths, arrowheads, corner radii, alignments, and semantic colors.
- Route connectors around unrelated objects and keep arrowheads clear of labels and node boundaries.
- Place microscopy, photographs, heatmaps, dense plots, and other irreducibly raster content on the dedicated raster layer. Never redraw scientific data inaccurately for visual neatness.
- State uncertainties instead of inventing unreadable labels, values, structures, or mechanisms.

## Delivery

Return clickable absolute paths for the editable `.ai` master and every SVG, PDF, and PNG export. State Illustrator/MCP validation status, artboard dimensions and color mode, the exact fonts and large/medium/small integer sizes used, preflight findings, intentionally rasterized content, and any unresolved limitation.
