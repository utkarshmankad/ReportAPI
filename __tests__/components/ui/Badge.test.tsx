import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('<Badge />', () => {
  it('renders children text', () => {
    render(<Badge variant="default">Beta</Badge>)
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Badge variant="default">Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toBeDefined()
  })

  it('renders success variant', () => {
    render(<Badge variant="success">Live</Badge>)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('success variant has distinct class from default', () => {
    const { rerender } = render(<Badge variant="default">Test</Badge>)
    const defaultClass = screen.getByText('Test').className

    rerender(<Badge variant="success">Test</Badge>)
    const successClass = screen.getByText('Test').className

    expect(defaultClass).not.toBe(successClass)
  })
})
