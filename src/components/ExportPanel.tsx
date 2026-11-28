import { useId, useState } from 'react'
import { useCopy } from '../hooks/useCopy'
import { exportPalette, FORMATS, type ExportFormat, type PaletteColor } from '../lib/export'

interface Props {
  colors: PaletteColor[]
  defaultName: string
  /** When given, a save button is shown. Returns false if it could not persist. */
  onSave?: (name: string, colors: PaletteColor[]) => boolean
}

export function ExportPanel({ colors, defaultName, onSave }: Props) {
  const id = useId()
  const [name, setName] = useState(defaultName)
  const [format, setFormat] = useState<ExportFormat>('css')
  const [saved, setSaved] = useState('')
  const { status, copy, reset } = useCopy()
  const code = exportPalette(format, name, colors)
  const formatName = FORMATS.find((f) => f.id === format)?.name ?? format

  const save = () => {
    const label = name.trim() || defaultName
    reset()
    setSaved(
      onSave?.(label, colors)
        ? `Saved "${label}"`
        : `"${label}" is kept for this session only: browser storage is unavailable.`,
    )
  }

  return (
    <div className="export">
      <div className="export-controls">
        <div>
          <label htmlFor={`${id}-name`}>Palette name</label>
          <input
            id={`${id}-name`}
            type="text"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${id}-format`}>Export format</label>
          <select
            id={`${id}-format`}
            value={format}
            onChange={(e) => {
              setFormat(e.target.value as ExportFormat)
              reset()
              setSaved('')
            }}
          >
            {FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <pre className="code" role="region" tabIndex={0} aria-label={`${formatName} code`}>
        <code>{code}</code>
      </pre>
      <div className="actions">
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setSaved('')
            void copy(code, formatName)
          }}
        >
          Copy code
        </button>
        {onSave && (
          <button type="button" className="ghost" onClick={save}>
            Save palette
          </button>
        )}
      </div>
      <p className="muted" aria-live="polite">
        {status || saved}
      </p>
    </div>
  )
}
