# huekit

A small, fast color toolkit that runs entirely in your browser: check WCAG contrast, build palettes, extract colors from images and export design tokens.

## Features

- [x] Parse and convert hex, `rgb()` and `hsl()` colors
- [x] WCAG 2.x contrast checker (AA / AAA, normal and large text) with live preview
- [x] One-click "closest passing text color" suggestion
- [ ] Palette generator: complementary, analogous, triadic and 50–900 shade scales
- [ ] Image palette extractor (canvas + k-means)
- [ ] Export to CSS variables, Tailwind config and JSON; saved palettes
- [ ] Accessibility polish, CI, v1.0.0

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
  components/           # ColorField, ContrastChecker
  App.tsx, index.css
```

## License

MIT © Dans-Vsa
