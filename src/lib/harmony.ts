import { hslToRgb, rgbToHex, rgbToHsl, type RGB } from './color'

export interface Harmony {
  id: 'complementary' | 'analogous' | 'triadic' | 'split'
  name: string
  colors: string[]
}

// Hue offsets in degrees around the color wheel; 0 is the base color itself.
const SCHEMES: { id: Harmony['id']; name: string; offsets: number[] }[] = [
  { id: 'complementary', name: 'Complementary', offsets: [0, 180] },
  { id: 'analogous', name: 'Analogous', offsets: [-30, 0, 30] },
  { id: 'triadic', name: 'Triadic', offsets: [0, 120, 240] },
  { id: 'split', name: 'Split complementary', offsets: [0, 150, 210] },
]

/** Rotate the hue of a color, keeping saturation and lightness. */
export function rotateHue(rgb: RGB, degrees: number): RGB {
  if (degrees === 0) return rgb
  const hsl = rgbToHsl(rgb)
  return hslToRgb({ ...hsl, h: hsl.h + degrees })
}

export function harmonies(base: RGB): Harmony[] {
  return SCHEMES.map(({ id, name, offsets }) => ({
    id,
    name,
    colors: offsets.map((offset) => rgbToHex(rotateHue(base, offset))),
  }))
}
