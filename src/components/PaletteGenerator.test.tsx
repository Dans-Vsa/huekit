import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaletteGenerator } from './PaletteGenerator'

const swatchesIn = (name: string) => within(screen.getByRole('list', { name })).getAllByRole('button')

const setBase = async (user: ReturnType<typeof userEvent.setup>, value: string) => {
  const input = screen.getByLabelText('Base color')
  await user.clear(input)
  await user.type(input, value)
}

describe('PaletteGenerator', () => {
  it('shows four harmonies and a ten step scale', () => {
    render(<PaletteGenerator />)
    expect(swatchesIn('Complementary')).toHaveLength(2)
    expect(swatchesIn('Analogous')).toHaveLength(3)
    expect(swatchesIn('Triadic')).toHaveLength(3)
    expect(swatchesIn('Split complementary')).toHaveLength(3)
    expect(swatchesIn('Shade scale')).toHaveLength(10)
  })

  it('updates when the base color changes', async () => {
    const user = userEvent.setup()
    render(<PaletteGenerator />)
    await setBase(user, '#ff0000')
    expect(swatchesIn('Complementary')[1]).toHaveTextContent('#00ffff')
  })

  it('copies a swatch to the clipboard and announces it', async () => {
    const user = userEvent.setup()
    render(<PaletteGenerator />)
    await user.click(screen.getByRole('button', { name: 'Copy 500 #5e6ad2 (base color)' }))
    expect(await navigator.clipboard.readText()).toBe('#5e6ad2')
    expect(screen.getByRole('status')).toHaveTextContent('Copied #5e6ad2')
  })

  it('explains when the clipboard is unavailable', async () => {
    const user = userEvent.setup()
    render(<PaletteGenerator />)
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
    await user.click(swatchesIn('Complementary')[0])
    expect(screen.getByRole('status')).toHaveTextContent('Could not copy')
    write.mockRestore()
  })

  it('hides the palette for invalid input and notes grays', async () => {
    const user = userEvent.setup()
    render(<PaletteGenerator />)
    await setBase(user, 'nope')
    expect(screen.queryByRole('list', { name: 'Shade scale' })).not.toBeInTheDocument()
    await setBase(user, '#808080')
    expect(screen.getByText(/Grays have no hue/)).toBeInTheDocument()
  })
})
