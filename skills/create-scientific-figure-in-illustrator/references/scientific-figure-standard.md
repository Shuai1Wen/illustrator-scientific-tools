# Scientific Figure Standard

## Layer model

Use these top-level layers unless the existing document has a meaningful compatible structure:

1. `00-Guides` - non-printing guides and alignment references; lock before delivery.
2. `10-Background` - panel backgrounds and large framing shapes.
3. `20-Raster` - microscopy, photographs, heatmaps, and placed data images.
4. `30-Structures` - cells, molecules, devices, organs, materials, and other primary vector objects.
5. `40-Connectors` - arrows, flow lines, brackets, axes, and relationship marks.
6. `50-Labels` - titles, panel letters, labels, annotations, legends, and scale-bar text.

Name important objects with a stable pattern such as `panel-a-cell-membrane`, `panel-b-flow-01`, or `legend-treatment-control`. Group repeated components by scientific role, not merely by proximity.

## Typography

- Use the exact Illustrator PostScript font `SimSun` for Chinese 宋体 text.
- Use the exact Illustrator PostScript font `ArialMT` for English text.
- Resolve both exact names with `list_fonts`; do not accept `NSimSun`, SimSun extension fonts, Adobe Song, or an Arial variant as an automatic substitute.
- Split mixed Chinese-English labels into separate aligned text frames by script. Do not silently substitute a font.
- Define exactly three positive integer point sizes for the figure. Default to 18 pt large, 14 pt medium, and 10 pt small.
- Use large for figure titles and major panel headings, medium for section labels and principal object labels, and small for annotations, legends, axis text, and minor labels.
- Never use fractional font sizes or one-off sizes. Resize/reposition geometry or select a different three-integer scale if text does not fit.
- Preserve editable text in the master. Produce outlined text only in a separate derivative when portability requires it.

## Geometry and styling

- Use a restrained palette with semantic consistency and sufficient contrast. Do not encode unrelated concepts with the same color.
- Use a small, declared set of stroke widths and arrowhead styles. Keep equivalent relationships visually identical.
- Keep panel margins, internal spacing, legend spacing, and alignment consistent.
- Use vector primitives for schematics. Keep raster data at sufficient effective resolution and do not resample upward as a substitute for real resolution.
- Keep scale bars, axes, units, statistical marks, and legends tied to the data they describe.
- Avoid unsupported live effects when a basic path, fill, stroke, gradient, or opacity can express the same result reliably.
