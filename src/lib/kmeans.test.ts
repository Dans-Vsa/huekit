import { describe, expect, it } from 'vitest'
import { kmeans, pixelsFromRgba } from './kmeans'

const red = { r: 255, g: 0, b: 0 }
const blue = { r: 0, g: 0, b: 255 }
const repeat = <T>(item: T, n: number) => Array.from({ length: n }, () => item)

describe('pixelsFromRgba', () => {
  it('reads pixels and skips transparent ones', () => {
    expect(pixelsFromRgba([255, 0, 0, 255, 0, 255, 0, 0])).toEqual([red])
  })
})

describe('kmeans', () => {
  it('returns dominant colors ordered by share', () => {
    const result = kmeans([...repeat(blue, 25), ...repeat(red, 75)], 2)
    expect(result).toEqual([
      { hex: '#ff0000', share: 0.75 },
      { hex: '#0000ff', share: 0.25 },
    ])
  })

  it('averages similar colors into one cluster', () => {
    const result = kmeans([{ r: 250, g: 0, b: 0 }, { r: 254, g: 0, b: 0 }, blue], 2)
    expect(result.map((c) => c.hex)).toEqual(['#fc0000', '#0000ff'])
  })

  it('never returns more colors than the image has', () => {
    expect(kmeans(repeat(red, 10), 5)).toEqual([{ hex: '#ff0000', share: 1 }])
  })

  it('handles empty input', () => {
    expect(kmeans([], 5)).toEqual([])
    expect(kmeans([red], 0)).toEqual([])
  })

  it('is deterministic', () => {
    const pixels = Array.from({ length: 300 }, (_, i) => ({
      r: (i * 37) % 256,
      g: (i * 91) % 256,
      b: (i * 13) % 256,
    }))
    expect(kmeans(pixels, 6)).toEqual(kmeans(pixels, 6))
  })
})
