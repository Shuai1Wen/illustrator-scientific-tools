# Font Gate

## Required exact fonts

- Chinese: PostScript name `SimSun`, family `宋体`, style `常规`.
- English: PostScript name `ArialMT`, family `Arial`, style `Regular`.

Call `list_fonts` with `SimSun`, `宋体`, and `ArialMT`. Pass the gate only when the returned font list contains the exact names `SimSun` and `ArialMT`. Do not accept `NSimSun`, `SimSun-ExtB`, `SimSun-ExtG`, `AdobeSongStd-Light`, or an Arial variant as an automatic substitute.

Create a small text probe only after both exact names resolve. Treat `font_warning`, candidate fallback data, substitution, or a mismatched returned font as failure and undo the probe immediately.

## Missing font behavior

- Do not silently substitute another font.
- Restart Illustrator after installing or enabling a font, then repeat the exact-name queries.
- Allow a geometry-only preview only when useful to the user. Keep `50-Labels` empty, create no placeholder text, and mark labeled final delivery as blocked.
- Use another Chinese or English font only when the user explicitly changes the typography requirement.
