export interface PaletteColor {
  label: string
  hex: string
}

export type ExportFormat = 'css' | 'tailwind' | 'json'

export const FORMATS: { id: ExportFormat; name: string }[] = [
  { id: 'css', name: 'CSS variables' },
  { id: 'tailwind', name: 'Tailwind config' },
  { id: 'json', name: 'JSON' },
]

/** Make a string safe to use as a CSS custom property or object key. */
export function slugify(text: string, fallback = 'palette'): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

const entries = (colors: PaletteColor[]) =>
  colors.map(({ label, hex }) => [slugify(label, 'color'), hex] as const)

export function exportPalette(format: ExportFormat, name: string, colors: PaletteColor[]): string {
  const slug = slugify(name)
  switch (format) {
    case 'css': {
      const lines = entries(colors).map(([key, hex]) => `  --${slug}-${key}: ${hex};`)
      return [':root {', ...lines, '}'].join('\n')
    }
    case 'tailwind': {
      const lines = entries(colors).map(([key, hex]) => `          '${key}': '${hex}',`)
      return [
        'export default {',
        '  theme: {',
        '    extend: {',
        '      colors: {',
        `        '${slug}': {`,
        ...lines,
        '        },',
        '      },',
        '    },',
        '  },',
        '}',
      ].join('\n')
    }
    case 'json':
      return JSON.stringify({ [slug]: Object.fromEntries(entries(colors)) }, null, 2)
  }
}
