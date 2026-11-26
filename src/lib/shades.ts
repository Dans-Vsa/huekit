import { hslToRgb, rgbToHex, rgbToHsl, type RGB } from './color'

export interface Shade {
  step: number
  hex: string
  isBase: boolean
}

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
// Target HSL lightness for each step, from lightest to darkest.
const LIGHTNESS = [97, 94, 86, 76, 66, 56, 47, 38, 29, 20]

/**
 * Build a 50-900 scale that keeps the hue and saturation of `base`.
 * The base color replaces the step with the closest lightness, so it always
 * appears unchanged and the scale still goes strictly from light to dark.
 */
export function shadeScale(base: RGB): Shade[] {
  const hsl = rgbToHsl(base)
  let anchor = 0
  LIGHTNESS.forEach((l, i) => {
    if (Math.abs(l - hsl.l) < Math.abs(LIGHTNESS[anchor] - hsl.l)) anchor = i
  })

  return STEPS.map((step, i) => ({
    step,
    hex: rgbToHex(i === anchor ? base : hslToRgb({ ...hsl, l: LIGHTNESS[i] })),
    isBase: i === anchor,
  }))
}
