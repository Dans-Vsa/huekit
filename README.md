# huekit

A small, fast color toolkit that runs entirely in your browser: check WCAG contrast, build palettes, extract colors from images and export design tokens.

## Features

- [x] Parse and convert hex, `rgb()` and `hsl()` colors
- [x] WCAG 2.x contrast checker (AA / AAA, normal and large text) with live preview
- [x] One-click "closest passing text color" suggestion
- [x] Palette generator: complementary, analogous, triadic and split-complementary harmonies
- [x] 50–900 shade scale that keeps your base color unchanged
- [x] Click any swatch to copy its hex value
- [x] Image palette extractor (canvas + k-means, 2-10 colors with their share of the image)
- [x] Export shade scales and image palettes as CSS variables, Tailwind config or JSON
- [x] Saved palettes, stored in your browser's `localStorage`
- [ ] Accessibility polish, CI, v1.0.0

## Using it

1. Pick a base color, then copy single swatches or export the whole shade scale.
2. Choose an image to pull out its dominant colors. The image is processed locally and never uploaded.
3. Name a palette and press **Save palette** to keep it in this browser.

## Tech stack

React 19, TypeScript, Vite, Vitest + Testing Library, oxlint. No backend, no tracking.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # run the unit and component tests
npm run build      # type-check and build for production
npm run lint
```

## Project structure

```
src/
  lib/color.ts          # parsing, conversion, WCAG math (pure functions)
  lib/harmony.ts        # hue rotation and color harmony schemes
  lib/shades.ts         # 50-900 lightness scale
  lib/kmeans.ts         # deterministic k-means color clustering
  lib/image.ts          # decode an image and sample its pixels
  lib/export.ts         # CSS variables, Tailwind and JSON formatters
  lib/storage.ts        # validated localStorage persistence
  hooks/                # useCopy, useSavedPalettes
  components/           # ContrastChecker, PaletteGenerator, ImageExtractor, ExportPanel, ...
  App.tsx, index.css
```

## License

MIT © Dans-Vsa
