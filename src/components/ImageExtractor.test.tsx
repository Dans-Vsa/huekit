import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ImageExtractor } from './ImageExtractor'

const file = new File(['x'], 'sunset.png', { type: 'image/png' })
const red = { r: 255, g: 0, b: 0 }
const blue = { r: 0, g: 0, b: 255 }

describe('ImageExtractor', () => {
  it('shows dominant colors with their share', async () => {
    const user = userEvent.setup()
    render(<ImageExtractor readPixels={async () => [red, red, red, blue]} />)
    await user.upload(screen.getByLabelText('Image file'), file)

    const list = await screen.findByRole('list', { name: 'Extracted colors' })
    const swatches = within(list).getAllByRole('button')
    expect(swatches).toHaveLength(2)
    expect(swatches[0]).toHaveAccessibleName('Copy 75% #ff0000')
    expect(screen.getByText('Colors from sunset.png')).toBeInTheDocument()
  })

  it('saves the extracted colors', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn(() => true)
    render(<ImageExtractor onSave={onSave} readPixels={async () => [red]} />)
    await user.upload(screen.getByLabelText('Image file'), file)
    await user.click(await screen.findByRole('button', { name: 'Save palette' }))
    expect(onSave).toHaveBeenCalledWith('image', [{ label: '1', hex: '#ff0000' }])
  })

  it('explains unreadable files', async () => {
    const user = userEvent.setup()
    render(<ImageExtractor readPixels={() => Promise.reject(new Error('bad'))} />)
    await user.upload(screen.getByLabelText('Image file'), file)
    expect(await screen.findByText(/Could not read that file/)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Extracted colors' })).not.toBeInTheDocument()
  })
})
