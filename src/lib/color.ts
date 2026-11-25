export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** Parse #rgb, #rrggbb, rgb(r, g, b) or hsl(h, s%, l%). Returns null when invalid. */
export function parseColor(input: string): RGB | null {
  const text = input.trim().toLowerCase()
  if (!text) return null

  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = [...h].map((c) => c + c).join('')
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }

  const rgb = /^rgb\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/.exec(text)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map(Number)
    if (r > 255 || g > 255 || b > 255) return null
    return { r, g, b }
  }

  const hsl = /^hsl\(\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)%\s*[, ]\s*(\d+(?:\.\d+)?)%\s*\)$/.exec(text)
  if (hsl) {
    const s = Number(hsl[2])
    const l = Number(hsl[3])
    if (s > 100 || l > 100) return null
    return hslToRgb({ h: Number(hsl[1]), s, l })
  }

  return null
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: s * 100, l: l * 100 }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = ((h % 360) + 360) % 360
  const sn = clamp(s, 0, 100) / 100
  const ln = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1))
  const m = ln - c / 2
  let [r, g, b] = [0, 0, 0]
  if (hn < 60) [r, g, b] = [c, x, 0]
  else if (hn < 120) [r, g, b] = [x, c, 0]
  else if (hn < 180) [r, g, b] = [0, c, x]
  else if (hn < 240) [r, g, b] = [0, x, c]
  else if (hn < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export const hexToHsl = (hex: string): HSL | null => {
  const rgb = parseColor(hex)
  return rgb ? rgbToHsl(rgb) : null
}

export const hslToHex = (hsl: HSL): string => rgbToHex(hslToRgb(hsl))

export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function formatHsl(rgb: RGB): string {
  const { h, s, l } = rgbToHsl(rgb)
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast ratio between two colors, from 1 to 21. */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export interface WcagResult {
  ratio: number
  aaNormal: boolean
  aaLarge: boolean
  aaaNormal: boolean
  aaaLarge: boolean
}

export function wcag(a: RGB, b: RGB): WcagResult {
  const ratio = contrastRatio(a, b)
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  }
}

/**
 * Nudge the lightness of `fg` (keeping hue and saturation) until it reaches
 * `target` contrast against `bg`. Returns the original color if already passing,
 * or null when the target cannot be reached.
 */
export function suggestForeground(fg: RGB, bg: RGB, target = 4.5): RGB | null {
  if (contrastRatio(fg, bg) >= target) return fg
  const hsl = rgbToHsl(fg)
  // Search both lighter and darker; the nearest passing lightness wins.
  for (let step = 1; step <= 100; step++) {
    for (const direction of [1, -1]) {
      const l = hsl.l + direction * step
      if (l < 0 || l > 100) continue
      const candidate = hslToRgb({ ...hsl, l })
      if (contrastRatio(candidate, bg) >= target) return candidate
    }
  }
  return null
}

/** Readable text color (black or white) for a given background. */
export function readableOn(bg: RGB): RGB {
  const white = { r: 255, g: 255, b: 255 }
  const black = { r: 0, g: 0, b: 0 }
  return contrastRatio(white, bg) >= contrastRatio(black, bg) ? white : black
}
