# Illustrator MCP Tool Routing

The plugin starts `illustrator-mcp-server@1.5.2` over stdio. Prefer its typed tools over general scripting.

## Session and inspection

- Use `set_illustrator_version` only when the user names a version or auto-detection selects the wrong installation.
- Use `list_fonts` before text creation. Its `name` result is the PostScript name required by `create_text_frame` and `modify_object`.
- Use `get_document_info` and `get_document_structure` before edits and after major changes.
- Use `get_artboards`, `get_layers`, `find_objects`, `get_selection`, `list_text_frames`, and `get_text_frame_detail` for targeted reads.

## Documents and coordinates

- Use `create_document` with width and height in points and an explicit `rgb` or `cmyk` color mode.
- Convert millimeters with `points = millimeters * 72 / 25.4`.
- Use `open_document` with an absolute path and omit forced color conversion unless requested.
- Use `coordinate_system="artboard-web"` consistently: origin at the active artboard's top-left, x rightward, y downward.
- Use `save_document` with `mode="save_as"` and an explicit path for new files and working copies. Use `mode="save"` only after confirming the active document is the intended working file.

## Creation and mutation

- Use `manage_layers` to add, rename, reorder, show, hide, lock, or unlock layers. Treat `delete` as destructive.
- Use `create_rectangle`, `create_ellipse`, `create_line`, `create_path`, `create_gradient`, `create_text_frame`, and `create_path_text` for native editable objects.
- Use `place_image` for raster content and `import_svg_as_editable` for vector SVG content.
- Use `group_objects`, `move_to_layer`, `set_z_order`, `align_objects`, and `modify_object` with returned UUIDs.
- Give each important object a semantic `name`. Never target an object by visual guess when a UUID is available.
- Check every mutation response for `success`, `verified`, `errors`, `font_warning`, and candidate fallback data. Use `undo` immediately after an unintended partial mutation.

## Review and export

- Use `export` with `target="artboard:<zero-based-index>"` and `format="png"` for review images. Use an absolute path and 150-300 DPI for inspection.
- Use `export` with `format="svg"`, editable text, embedded raster images, presentation attributes, object-based IDs, and reasonable coordinate precision for the editable vector derivative.
- After SVG export, verify the exact requested path exists. Localized Illustrator may create `<basename>_<artboard-name>.svg` while the MCP reports that the requested file was not created. When that false negative occurs, run `node ../../../scripts/normalize-svg-export.mjs <absolute-expected.svg>` from the skill directory. The script accepts only a recent same-directory `<basename>_*.svg`, validates the SVG root, refuses overwrite, and renames the derivative. It never edits the `.ai` master.
- Treat a missing file with no recent valid candidate as a real export failure. Do not claim success from the MCP response alone.
- Use `export_pdf` for PDF delivery and select the requested print or journal profile when available.
- Run `preflight_check` before final export. Use at least 300 DPI for print-oriented figures.
- Save the editable `.ai` master before creating any outlined derivative.
