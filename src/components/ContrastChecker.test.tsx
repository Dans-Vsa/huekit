import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContrastChecker } from './ContrastChecker'

describe('ContrastChecker', () => {
  it('shows the contrast ratio for the default colors', () => {
    render(<ContrastChecker />)
    const ratio = Number(screen.getByTestId('ratio').textContent)
    expect(ratio).toBeGreaterThan(3)
  })

  it('computes 21:1 for black on white', async () => {
    const user = userEvent.setup()
    render(<ContrastChecker />)
    const text = screen.getByLabelText('Text color')
    const bg = screen.getByLabelText('Background color')
    await user.clear(text)
    await user.type(text, '#000000')
    await user.clear(bg)
    await user.type(bg, '#ffffff')
    expect(screen.getByTestId('ratio')).toHaveTextContent('21.00')
    expect(screen.getAllByText('Pass')).toHaveLength(4)
  })

  it('flags invalid input and offers a fix for low contrast', async () => {
    const user = userEvent.setup()
    render(<ContrastChecker />)
    const text = screen.getByLabelText('Text color')
    await user.clear(text)
    await user.type(text, 'nope')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await user.clear(text)
    await user.type(text, '#777777')
    const bg = screen.getByLabelText('Background color')
    await user.clear(bg)
    await user.type(bg, '#888888')
    expect(screen.getByText(/Closest passing text color/)).toBeInTheDocument()
  })

  it('swaps colors', async () => {
    const user = userEvent.setup()
    render(<ContrastChecker />)
    await user.click(screen.getByRole('button', { name: 'Swap colors' }))
    expect(screen.getByLabelText('Text color')).toHaveValue('#5e6ad2')
  })
})
