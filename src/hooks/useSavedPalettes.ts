import { useState } from 'react'
import type { PaletteColor } from '../lib/export'
import { loadPalettes, MAX_SAVED, storePalettes, type SavedPalette } from '../lib/storage'

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Saved palettes, newest first, mirrored to localStorage. */
export function useSavedPalettes() {
  const [palettes, setPalettes] = useState<SavedPalette[]>(loadPalettes)

  const update = (next: SavedPalette[]) => {
    setPalettes(next)
    return storePalettes(next)
  }

  const save = (name: string, colors: PaletteColor[]) =>
    update([{ id: newId(), name, colors }, ...palettes].slice(0, MAX_SAVED))

  const remove = (id: string) => {
    update(palettes.filter((p) => p.id !== id))
  }

  return { palettes, save, remove }
}
