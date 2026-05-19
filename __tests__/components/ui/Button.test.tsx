import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('<Button />', () => {
  it('renders children', () => {
    render(<Button variant="primary" size="md">Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('has type="button" by default', () => {
    render(<Button variant="primary" size="md">Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('calls onClick when clicked', async () => {
    const handler = jest.fn()
    render(<Button variant="primary" size="md" onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', async () => {
    const handler = jest.fn()
    render(<Button variant="primary" size="md" disabled onClick={handler}>Disabled</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders primary variant classes', () => {
    render(<Button variant="primary" size="md">Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/bg-/)
  })

  it('renders ghost variant without solid background', () => {
    render(<Button variant="ghost" size="md">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).not.toMatch(/bg-\[--color-accent\]/)
  })

  it('applies sm size classes', () => {
    render(<Button variant="primary" size="sm">Small</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/text-sm|px-3|py-1/)
  })

  it('applies lg size classes', () => {
    render(<Button variant="primary" size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/text-base|px-6|py-3/)
  })

  it('forwards extra HTML attributes', () => {
    render(<Button variant="primary" size="md" aria-label="submit form">Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'submit form')
  })
})
