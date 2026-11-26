import { useState } from 'react'
import { parseColor, rgbToHsl } from '../lib/color'
import { harmonies } from '../lib/harmony'
import { shadeScale } from '../lib/shades'
import { ColorField } from './ColorField'
import { Swatch } from './Swatch'

export function PaletteGenerator() {
  const [base, setBase] = useState('#5e6ad2')
  const [status, setStatus] = useState('')
  const rgb = parseColor(base)

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setStatus(`Copied ${hex}`)
    } catch {
      setStatus(`Could not copy. Select it manually: ${hex}`)
    }
  }

  const changeBase = (value: string) => {
    setBase(value)
    setStatus('')
  }

  return (
    <section aria-labelledby="palette-title" className="panel">
      <h2 id="palette-title">Palette generator</h2>
      <ColorField label="Base color" value={base} onChange={changeBase} />
      <p className="muted status" role="status">
        {status || 'Select any swatch to copy its hex value.'}
      </p>

      {rgb ? (
        <>
          {rgbToHsl(rgb).s < 1 && (
            <p className="muted">Grays have no hue, so every harmony looks the same.</p>
          )}
          <div className="harmonies">
            {harmonies(rgb).map((harmony) => (
              <div key={harmony.id}>
                <h3 id={`harmony-${harmony.id}`}>{harmony.name}</h3>
                <ul className="swatches" aria-labelledby={`harmony-${harmony.id}`}>
                  {harmony.colors.map((hex, i) => (
                    <Swatch key={i} hex={hex} onCopy={copy} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 id="shades-title">Shade scale</h3>
          <ul className="swatches scale" aria-labelledby="shades-title">
            {shadeScale(rgb).map((shade) => (
              <Swatch
                key={shade.step}
                hex={shade.hex}
                caption={String(shade.step)}
                highlight={shade.isBase}
                onCopy={copy}
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="muted">Enter a valid base color to generate a palette.</p>
      )}
    </section>
  )
}
