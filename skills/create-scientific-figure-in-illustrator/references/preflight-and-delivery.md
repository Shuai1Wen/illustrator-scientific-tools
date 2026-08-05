# Preflight and Delivery

## Structural checks

- Confirm the intended active document, save path, artboard count, dimensions, color mode, and color profile.
- Confirm the standard layers exist, important objects are named, guides are locked, required layers are visible, and no unintended hidden artwork remains.
- Confirm all referenced or linked images resolve and print-oriented raster content has at least 300 effective DPI unless the user specifies another threshold.

## Scientific and visual checks

- Compare every panel with the reference or approved specification.
- Check wording, values, units, panel letters, legends, topology, arrow direction, grouping, and quantitative encodings.
- Check clipping, overlap, alignment, whitespace, stroke consistency, arrowhead placement, raster quality, and color contrast using a final PNG review export.
- Do not treat a clean technical preflight as proof of scientific correctness.

## Typography checks

- Inspect all text frames and report every font family and point size in use.
- Require Chinese text to use exact PostScript name `SimSun` and English text to use exact PostScript name `ArialMT`.
- Require every point size to equal one of the declared large/medium/small positive integers.
- Treat missing fonts, substituted fonts, fractional sizes, overset area text, clipped labels, and unintended outlined master text as blocking findings.

## Native and derivative outputs

1. Save the editable `.ai` master with live text and organized layers.
2. Export an editable SVG derivative with live text for downstream vector use.
3. Export a PDF appropriate to the requested screen, journal, or print workflow.
4. Export a full-artboard PNG review image, normally at 300 DPI for publication figures.
5. If a portable outlined version is requested, save it under a distinct filename after the editable master is safe. Never overwrite the master.

Verify every requested output exists and is non-empty. Parse SVG as XML, confirm its root is `svg`, and confirm its `viewBox` matches the intended artboard. Account for Illustrator's localized artboard suffix only through the guarded normalization procedure in [tool-routing.md](tool-routing.md).

Report output paths, file existence, preflight errors and warnings, exact fonts, the three integer sizes, raster exceptions, and any check that could not be completed.
