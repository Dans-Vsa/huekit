import { parseColor } from './color'
import type { PaletteColor } from './export'

export interface SavedPalette {
  id: string
  name: string
  colors: PaletteColor[]
}

export const STORAGE_KEY = 'huekit.palettes'
export const MAX_SAVED = 50

const isColor = (value: unknown): value is PaletteColor => {
  const c = value as PaletteColor
  return typeof c?.label === 'string' && typeof c.hex === 'string' && parseColor(c.hex) !== null
}

const isPalette = (value: unknown): value is SavedPalette => {
  const p = value as SavedPalette
  return (
    typeof p?.id === 'string' &&
    typeof p.name === 'string' &&
    Array.isArray(p.colors) &&
    p.colors.length > 0 &&
    p.colors.every(isColor)
  )
}

/** Read saved palettes. Missing, blocked or corrupt storage yields an empty list. */
export function loadPalettes(): SavedPalette[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isPalette).slice(0, MAX_SAVED) : []
  } catch {
    return []
  }
}

/** Persist palettes. Returns false when the browser refuses (quota, privacy mode). */
export function storePalettes(palettes: SavedPalette[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
    return true
  } catch {
    return false
  }
}
