import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  formatHsl,
  hexToHsl,
  hslToHex,
  parseColor,
  readableOn,
  rgbToHex,
  rgbToHsl,
  suggestForeground,
  wcag,
} from './color'

const WHITE = { r: 255, g: 255, b: 255 }
const BLACK = { r: 0, g: 0, b: 0 }

describe('parseColor', () => {
  it('parses 6 and 3 digit hex, with or without #', () => {
    expect(parseColor('#ff8000')).toEqual({ r: 255, g: 128, b: 0 })
    expect(parseColor('FFF')).toEqual(WHITE)
    expect(parseColor('#0a0')).toEqual({ r: 0, g: 170, b: 0 })
  })

  it('parses rgb() and hsl()', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30 })
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('rejects invalid input', () => {
    expect(parseColor('')).toBeNull()
    expect(parseColor('#12')).toBeNull()
    expect(parseColor('rgb(300, 0, 0)')).toBeNull()
    expect(parseColor('hsl(10, 120%, 50%)')).toBeNull()
    expect(parseColor('banana')).toBeNull()
  })
})

describe('conversions', () => {
  it('round-trips hex through hsl', () => {
    for (const hex of ['#5e6ad2', '#27a644', '#ff00ff', '#808080']) {
      const hsl = hexToHsl(hex)!
      expect(hslToHex(hsl)).toBe(hex)
    }
  })

  it('computes known hsl values', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    expect(formatHsl(WHITE)).toBe('hsl(0, 0%, 100%)')
  })

  it('formats hex with padding', () => {
    expect(rgbToHex({ r: 1, g: 2, b: 3 })).toBe('#010203')
  })
})

describe('contrast', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5)
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5)
    // #767676 on white is the classic 4.54:1 AA boundary
    expect(contrastRatio(parseColor('#767676')!, WHITE)).toBeCloseTo(4.54, 2)
  })

  it('reports AA / AAA thresholds', () => {
    const grey = wcag(parseColor('#767676')!, WHITE)
    expect(grey.aaNormal).toBe(true)
    expect(grey.aaaNormal).toBe(false)
    expect(grey.aaaLarge).toBe(true)
    const light = wcag(parseColor('#aaaaaa')!, WHITE)
    expect(light.aaNormal).toBe(false)
    expect(light.aaLarge).toBe(false)
  })

  it('suggests a passing foreground', () => {
    const fg = parseColor('#aaaaaa')!
    const fixed = suggestForeground(fg, WHITE, 4.5)!
    expect(contrastRatio(fixed, WHITE)).toBeGreaterThanOrEqual(4.5)
    expect(suggestForeground(WHITE, WHITE, 4.5)).not.toBeNull()
  })

  it('chooses readable text color', () => {
    expect(readableOn(BLACK)).toEqual(WHITE)
    expect(readableOn(WHITE)).toEqual(BLACK)
  })
})
