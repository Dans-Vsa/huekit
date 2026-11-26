import { describe, expect, it } from 'vitest'
import { parseColor, relativeLuminance } from './color'
import { shadeScale } from './shades'

const luminances = (hex: string) =>
  shadeScale(parseColor(hex)!).map((s) => relativeLuminance(parseColor(s.hex)!))

describe('shadeScale', () => {
  it('returns the ten steps from 50 to 900', () => {
    const steps = shadeScale(parseColor('#5e6ad2')!).map((s) => s.step)
    expect(steps).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900])
  })

  it('keeps the base color unchanged on exactly one step', () => {
    const base = shadeScale(parseColor('#5e6ad2')!).filter((s) => s.isBase)
    expect(base).toHaveLength(1)
    expect(base[0]).toMatchObject({ step: 500, hex: '#5e6ad2' })
  })

  it.each(['#5e6ad2', '#ffffff', '#000000', '#ffee00', '#101a40'])(
    'goes strictly from light to dark for %s',
    (hex) => {
      const values = luminances(hex)
      for (let i = 1; i < values.length; i++) expect(values[i]).toBeLessThan(values[i - 1])
    },
  )

  it('anchors white at 50 and black at 900', () => {
    expect(shadeScale(parseColor('#fff')!).find((s) => s.isBase)?.step).toBe(50)
    expect(shadeScale(parseColor('#000')!).find((s) => s.isBase)?.step).toBe(900)
  })
})
