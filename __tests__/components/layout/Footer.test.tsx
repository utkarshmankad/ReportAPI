import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('<Footer />', () => {
  beforeEach(() => render(<Footer />))

  it('renders brand name', () => {
    expect(screen.getByText('ReportAPI')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    expect(screen.getByText(/raw data in/i)).toBeInTheDocument()
  })

  it('renders Product column heading', () => {
    expect(screen.getByText(/product/i)).toBeInTheDocument()
  })

  it('renders Legal column heading', () => {
    expect(screen.getByText(/legal/i)).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    expect(screen.getByText(/2026 ReportAPI/i)).toBeInTheDocument()
  })

  it('renders DPDP Compliance link', () => {
    expect(screen.getByRole('link', { name: /dpdp/i })).toBeInTheDocument()
  })

  it('renders Privacy Policy link', () => {
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument()
  })

  it('renders Terms of Service link', () => {
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument()
  })
})
