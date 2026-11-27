import { useState } from 'react'

/** Copy text to the clipboard and expose a human readable status message. */
export function useCopy() {
  const [status, setStatus] = useState('')

  const copy = async (text: string, label = text) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(`Copied ${label}`)
    } catch {
      setStatus(`Could not copy. Select it manually: ${label}`)
    }
  }

  return { status, copy, reset: () => setStatus('') }
}
