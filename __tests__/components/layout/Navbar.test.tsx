import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'

describe('<Navbar />', () => {
  beforeEach(() => render(<Navbar />))

  it('renders the brand name', () => {
    expect(screen.getByText('ReportAPI')).toBeInTheDocument()
  })

  it('renders Features nav link', () => {
    expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument()
  })

  it('renders Pricing nav link', () => {
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument()
  })

  it('renders Docs nav link', () => {
    expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    expect(screen.getByRole('button', { name: /get api key/i })).toBeInTheDocument()
  })

  it('nav has aria-label for accessibility', () => {
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('Features link points to #features', () => {
    expect(screen.getByRole('link', { name: /features/i })).toHaveAttribute('href', '#features')
  })

  it('Pricing link points to #pricing', () => {
    expect(screen.getByRole('link', { name: /pricing/i })).toHaveAttribute('href', '#pricing')
  })
})
