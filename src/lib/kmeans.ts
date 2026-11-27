import { rgbToHex, type RGB } from './color'

export interface Cluster {
  hex: string
  /** Fraction of sampled pixels in this cluster, 0 to 1. */
  share: number
}

/** Convert canvas RGBA data to pixels, ignoring mostly transparent ones. */
export function pixelsFromRgba(data: ArrayLike<number>): RGB[] {
  const pixels: RGB[] = []
  for (let i = 0; i + 3 < data.length; i += 4) {
    if (data[i + 3] < 128) continue
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
  }
  return pixels
}

const distance = (a: RGB, b: RGB) => (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2

function mean(pixels: RGB[]): RGB {
  let r = 0
  let g = 0
  let b = 0
  for (const p of pixels) {
    r += p.r
    g += p.g
    b += p.b
  }
  return { r: r / pixels.length, g: g / pixels.length, b: b / pixels.length }
}

function nearest(pixel: RGB, centers: RGB[]): number {
  let best = 0
  for (let i = 1; i < centers.length; i++) {
    if (distance(pixel, centers[i]) < distance(pixel, centers[best])) best = i
  }
  return best
}

/** Deterministic farthest-point seeding, so one image always gives one palette. */
function seed(pixels: RGB[], k: number): RGB[] {
  const average = mean(pixels)
  const centers = [pixels[nearest(average, pixels)]]
  const gaps = pixels.map((p) => distance(p, centers[0]))

  while (centers.length < k) {
    let far = 0
    for (let i = 1; i < gaps.length; i++) if (gaps[i] > gaps[far]) far = i
    if (gaps[far] === 0) break // fewer distinct colors than requested
    const next = pixels[far]
    centers.push(next)
    pixels.forEach((p, i) => {
      gaps[i] = Math.min(gaps[i], distance(p, next))
    })
  }
  return centers
}

/** Group pixels into at most `k` dominant colors, largest group first. */
export function kmeans(pixels: RGB[], k: number, maxIterations = 20): Cluster[] {
  if (pixels.length === 0 || k < 1) return []

  let centers = seed(pixels, k)
  let groups: RGB[][] = []

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    groups = centers.map(() => [])
    for (const p of pixels) groups[nearest(p, centers)].push(p)

    const next = groups.map((group, i) => (group.length ? mean(group) : centers[i]))
    const moved = next.some((c, i) => distance(c, centers[i]) > 0.25)
    centers = next
    if (!moved) break
  }

  return centers
    .map((center, i) => ({ hex: rgbToHex(center), share: groups[i].length / pixels.length }))
    .filter((cluster) => cluster.share > 0)
    .sort((a, b) => b.share - a.share)
}
