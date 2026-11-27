import type { RGB } from './color'
import { pixelsFromRgba } from './kmeans'

const MAX_SIDE = 160

/** Decode an image file in the browser and sample its pixels from a small canvas. */
export async function readImagePixels(file: Blob): Promise<RGB[]> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas is not available')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return pixelsFromRgba(context.getImageData(0, 0, canvas.width, canvas.height).data)
  } finally {
    bitmap.close()
  }
}
