import { useState } from 'react'
import { useCopy } from '../hooks/useCopy'
import type { SavedPalette } from '../lib/storage'
import { ExportPanel } from './ExportPanel'
import { Swatch } from './Swatch'

interface Props {
  palettes: SavedPalette[]
  onRemove: (id: string) => void
}

export function SavedPalettes({ palettes, onRemove }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const { status, copy } = useCopy()

  return (
    <section aria-labelledby="saved-title" className="panel">
      <h2 id="saved-title">Saved palettes</h2>
      {palettes.length === 0 && (
        <p className="muted">Nothing saved yet. Palettes are stored only in this browser.</p>
      )}
      <p className="muted" aria-live="polite">
        {status}
      </p>
      {palettes.map((palette) => {
        const open = openId === palette.id
        return (
          <article key={palette.id} className="saved">
            <h3 id={`saved-${palette.id}`}>{palette.name}</h3>
            <ul className="swatches" aria-labelledby={`saved-${palette.id}`}>
              {palette.colors.map((color, i) => (
                <Swatch key={i} hex={color.hex} onCopy={copy} />
              ))}
            </ul>
            <div className="actions">
              <button
                type="button"
                className="ghost"
                aria-expanded={open}
                aria-label={`Export ${palette.name}`}
                onClick={() => setOpenId(open ? null : palette.id)}
              >
                Export
              </button>
              <button
                type="button"
                className="ghost"
                aria-label={`Delete ${palette.name}`}
                onClick={() => onRemove(palette.id)}
              >
                Delete
              </button>
            </div>
            {open && <ExportPanel colors={palette.colors} defaultName={palette.name} />}
          </article>
        )
      })}
    </section>
  )
}
