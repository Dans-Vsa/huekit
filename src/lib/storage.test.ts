import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadPalettes, STORAGE_KEY, storePalettes } from './storage'

const palette = { id: 'a', name: 'Brand', colors: [{ label: '500', hex: '#5e6ad2' }] }

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('palette storage', () => {
  it('round-trips palettes', () => {
    expect(storePalettes([palette])).toBe(true)
    expect(loadPalettes()).toEqual([palette])
  })

  it('ignores corrupt or invalid data', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadPalettes()).toEqual([])

    const bad = { id: 'b', name: 'Bad', colors: [{ label: '1', hex: 'red; }' }] }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([null, bad, palette]))
    expect(loadPalettes()).toEqual([palette])
  })

  it('reports a failed write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(storePalettes([palette])).toBe(false)
  })
})
