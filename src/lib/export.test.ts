import { describe, expect, it } from 'vitest'
import { exportPalette, slugify } from './export'

const colors = [
  { label: '50', hex: '#f5f5ff' },
  { label: '500', hex: '#5e6ad2' },
]

describe('slugify', () => {
  it('produces safe identifiers with a fallback', () => {
    expect(slugify('  My Brand!! ')).toBe('my-brand')
    expect(slugify("'}; --x")).toBe('x')
    expect(slugify('***')).toBe('palette')
  })
})

describe('exportPalette', () => {
  it('writes CSS custom properties', () => {
    expect(exportPalette('css', 'Brand', colors)).toBe(
      ':root {\n  --brand-50: #f5f5ff;\n  --brand-500: #5e6ad2;\n}',
    )
  })

  it('writes a Tailwind theme extension', () => {
    const code = exportPalette('tailwind', 'Brand', colors)
    expect(code).toMatch(/^export default \{/)
    expect(code).toContain("'brand': {")
    expect(code).toContain("'500': '#5e6ad2',")
  })

  it('writes parseable JSON', () => {
    expect(JSON.parse(exportPalette('json', 'Brand', colors))).toEqual({
      brand: { '50': '#f5f5ff', '500': '#5e6ad2' },
    })
  })
})
