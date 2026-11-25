import { useState } from 'react'
import { formatHsl, parseColor, rgbToHex, suggestForeground, wcag } from '../lib/color'
import { ColorField } from './ColorField'

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <li className={pass ? 'badge pass' : 'badge fail'}>
      <span>{label}</span>
      <strong>{pass ? 'Pass' : 'Fail'}</strong>
    </li>
  )
}

export function ContrastChecker() {
  const [fg, setFg] = useState('#f7f8f8')
  const [bg, setBg] = useState('#5e6ad2')

  const fgRgb = parseColor(fg)
  const bgRgb = parseColor(bg)
  const result = fgRgb && bgRgb ? wcag(fgRgb, bgRgb) : null
  const fix = fgRgb && bgRgb && result && !result.aaNormal ? suggestForeground(fgRgb, bgRgb, 4.5) : null

  const swap = () => {
    setFg(bg)
    setBg(fg)
  }

  return (
    <section aria-labelledby="contrast-title" className="panel">
      <h2 id="contrast-title">Contrast checker</h2>
      <div className="grid-2">
        <ColorField label="Text color" value={fg} onChange={setFg} />
        <ColorField label="Background color" value={bg} onChange={setBg} />
      </div>
      <button type="button" className="ghost" onClick={swap}>
        Swap colors
      </button>

      {result && fgRgb && bgRgb ? (
        <>
          <div
            className="preview"
            style={{ color: rgbToHex(fgRgb), background: rgbToHex(bgRgb) }}
            data-testid="preview"
          >
            <p className="preview-large">Large text sample</p>
            <p>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <p className="ratio" aria-live="polite">
            <span data-testid="ratio">{result.ratio.toFixed(2)}</span>
            <small>: 1 contrast ratio</small>
          </p>
          <ul className="badges">
            <Badge label="AA normal text (4.5)" pass={result.aaNormal} />
            <Badge label="AA large text (3)" pass={result.aaLarge} />
            <Badge label="AAA normal text (7)" pass={result.aaaNormal} />
            <Badge label="AAA large text (4.5)" pass={result.aaaLarge} />
          </ul>
          <p className="muted">
            Text {formatHsl(fgRgb)} on background {formatHsl(bgRgb)}
          </p>
          {fix && (
            <p className="suggestion">
              Closest passing text color:{' '}
              <button type="button" className="link" onClick={() => setFg(rgbToHex(fix))}>
                {rgbToHex(fix)}
              </button>
            </p>
          )}
        </>
      ) : (
        <p className="muted">Enter two valid colors to see the contrast ratio.</p>
      )}
    </section>
  )
}
