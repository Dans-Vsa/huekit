import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { useSavedPalettes } from '../hooks/useSavedPalettes'
import { loadPalettes } from '../lib/storage'
import { ExportPanel } from './ExportPanel'
import { SavedPalettes } from './SavedPalettes'

function Harness() {
  const { palettes, save, remove } = useSavedPalettes()
  return (
    <>
      <ExportPanel colors={[{ label: '500', hex: '#5e6ad2' }]} defaultName="brand" onSave={save} />
      <SavedPalettes palettes={palettes} onRemove={remove} />
    </>
  )
}

afterEach(() => window.localStorage.clear())

describe('export and saved palettes', () => {
  it('switches format and copies the code', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.selectOptions(screen.getByLabelText('Export format'), 'json')
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(JSON.parse(await navigator.clipboard.readText())).toEqual({
      brand: { '500': '#5e6ad2' },
    })
    expect(screen.getByText('Copied JSON')).toBeInTheDocument()
  })

  it('saves, persists and deletes a palette', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const name = screen.getByLabelText('Palette name')
    await user.clear(name)
    await user.type(name, 'Ocean')
    await user.click(screen.getByRole('button', { name: 'Save palette' }))

    expect(screen.getByRole('heading', { name: 'Ocean' })).toBeInTheDocument()
    expect(loadPalettes()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Export Ocean' }))
    expect(screen.getAllByLabelText('CSS variables code')[1]).toHaveTextContent('--ocean-500')

    await user.click(screen.getByRole('button', { name: 'Delete Ocean' }))
    expect(screen.getByText(/Nothing saved yet/)).toBeInTheDocument()
    expect(loadPalettes()).toHaveLength(0)
  })
})
