import { describe, expect, it } from 'vitest'
import { harmonies, rotateHue } from './harmony'

const red = { r: 255, g: 0, b: 0 }

describe('rotateHue', () => {
  it('turns red into cyan at 180 degrees', () => {
    expect(rotateHue(red, 180)).toEqual({ r: 0, g: 255, b: 255 })
  })

  it('wraps negative angles around the wheel', () => {
    expect(rotateHue(red, -120)).toEqual({ r: 0, g: 0, b: 255 })
  })
})

describe('harmonies', () => {
  const byId = Object.fromEntries(harmonies(red).map((h) => [h.id, h.colors]))

  it('builds the expected schemes for pure red', () => {
    expect(byId.complementary).toEqual(['#ff0000', '#00ffff'])
    expect(byId.analogous).toEqual(['#ff0080', '#ff0000', '#ff8000'])
    expect(byId.triadic).toEqual(['#ff0000', '#00ff00', '#0000ff'])
    expect(byId.split).toEqual(['#ff0000', '#00ff80', '#0080ff'])
  })

  it('keeps the base color exact in every scheme', () => {
    for (const { colors } of harmonies({ r: 94, g: 106, b: 210 })) {
      expect(colors).toContain('#5e6ad2')
    }
  })
})
