// @vitest-environment node
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from './lib/color'

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')

function token(name: string) {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`).exec(css)?.[1]
  const rgb = value ? parseColor(value) : null
  if (!rgb) throw new Error(`missing color token --${name}`)
  return rgb
}

describe('UI theme contrast', () => {
  it.each(['ink', 'ink-muted', 'ink-subtle'])('--%s text meets AA on every surface', (name) => {
    for (const surface of ['canvas', 'surface', 'surface-2']) {
      expect(contrastRatio(token(name), token(surface))).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('control borders meet the 3:1 non-text minimum', () => {
    for (const surface of ['surface', 'surface-2']) {
      expect(contrastRatio(token('control-border'), token(surface))).toBeGreaterThanOrEqual(3)
    }
  })
})
