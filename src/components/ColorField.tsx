import { useId } from 'react'
import { parseColor, rgbToHex } from '../lib/color'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

/** Text input plus native color picker; flags invalid input accessibly. */
export function ColorField({ label, value, onChange }: Props) {
  const id = useId()
  const rgb = parseColor(value)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-row">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={rgb ? rgbToHex(rgb) : '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          id={id}
          type="text"
          spellCheck={false}
          value={value}
          aria-invalid={!rgb}
          aria-describedby={rgb ? undefined : `${id}-err`}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {!rgb && (
        <p id={`${id}-err`} className="error" role="alert">
          Use hex, rgb() or hsl().
        </p>
      )}
    </div>
  )
}
