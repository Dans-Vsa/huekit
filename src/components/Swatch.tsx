import { parseColor, readableOn, rgbToHex } from '../lib/color'

interface Props {
  hex: string
  caption?: string
  highlight?: boolean
  onCopy: (hex: string) => void
}

/** A color tile that copies its hex value when activated. */
export function Swatch({ hex, caption, highlight = false, onCopy }: Props) {
  const rgb = parseColor(hex)
  const text = rgb ? rgbToHex(readableOn(rgb)) : undefined
  return (
    <li>
      <button
        type="button"
        className={highlight ? 'swatch is-base' : 'swatch'}
        style={{ background: hex, color: text }}
        aria-label={`Copy ${caption ? `${caption} ` : ''}${hex}${highlight ? ' (base color)' : ''}`}
        onClick={() => onCopy(hex)}
      >
        {caption && <strong>{caption}</strong>}
        <span>{hex}</span>
      </button>
    </li>
  )
}
