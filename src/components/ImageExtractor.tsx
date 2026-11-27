import { useId, useMemo, useRef, useState } from 'react'
import { useCopy } from '../hooks/useCopy'
import type { RGB } from '../lib/color'
import type { PaletteColor } from '../lib/export'
import { readImagePixels } from '../lib/image'
import { kmeans } from '../lib/kmeans'
import { ExportPanel } from './ExportPanel'
import { Swatch } from './Swatch'

interface Props {
  onSave?: (name: string, colors: PaletteColor[]) => boolean
  /** Replaceable in tests, where there is no real canvas. */
  readPixels?: (file: Blob) => Promise<RGB[]>
}

export function ImageExtractor({ onSave, readPixels = readImagePixels }: Props) {
  const id = useId()
  const [pixels, setPixels] = useState<RGB[] | null>(null)
  const [count, setCount] = useState(5)
  const [message, setMessage] = useState('Pick an image. It never leaves your device.')
  const { status, copy, reset } = useCopy()
  const request = useRef(0)

  const clusters = useMemo(() => (pixels ? kmeans(pixels, count) : []), [pixels, count])
  const colors = clusters.map((c, i) => ({ label: String(i + 1), hex: c.hex }))

  const open = async (file: File | undefined) => {
    if (!file) return
    const current = ++request.current
    reset()
    setPixels(null)
    setMessage('Reading image…')
    try {
      const result = await readPixels(file)
      if (current !== request.current) return // a newer file was picked meanwhile
      setPixels(result)
      setMessage(result.length ? `Colors from ${file.name}` : 'That image is fully transparent.')
    } catch {
      if (current !== request.current) return
      setMessage('Could not read that file. Try a PNG, JPEG, WebP or GIF image.')
    }
  }

  return (
    <section aria-labelledby="image-title" className="panel">
      <h2 id="image-title">Image palette</h2>
      <div className="export-controls">
        <div>
          <label htmlFor={`${id}-file`}>Image file</label>
          <input
            id={`${id}-file`}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => void open(e.target.files?.[0])}
          />
        </div>
        <div>
          <label htmlFor={`${id}-count`}>Colors: {count}</label>
          <input
            id={`${id}-count`}
            type="range"
            min={2}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>
      <p className="muted status" aria-live="polite">
        {status || message}
      </p>

      {colors.length > 0 && (
        <>
          <ul className="swatches" aria-label="Extracted colors">
            {clusters.map((cluster, i) => (
              <Swatch
                key={i}
                hex={cluster.hex}
                caption={`${Math.max(1, Math.round(cluster.share * 100))}%`}
                onCopy={copy}
              />
            ))}
          </ul>
          <ExportPanel colors={colors} defaultName="image" onSave={onSave} />
        </>
      )}
    </section>
  )
}
