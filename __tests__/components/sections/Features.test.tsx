import { render, screen } from '@testing-library/react'
import { Features } from '@/components/sections/Features'

describe('<Features />', () => {
  beforeEach(() => render(<Features />))

  it('renders section with id="features"', () => {
    expect(document.getElementById('features')).toBeInTheDocument()
  })

  it('renders the h2 heading', () => {
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders all three step titles', () => {
    expect(screen.getByText(/send data/i)).toBeInTheDocument()
    expect(screen.getByText(/template applied/i)).toBeInTheDocument()
    expect(screen.getByText(/receive narrative/i)).toBeInTheDocument()
  })

  it('renders Sub-4s latency feature', () => {
    expect(screen.getByText(/sub-4s latency/i)).toBeInTheDocument()
  })

  it('renders PII guard feature', () => {
    expect(screen.getByText(/pii guard/i)).toBeInTheDocument()
  })

  it('renders Template system feature', () => {
    expect(screen.getByText(/template system/i)).toBeInTheDocument()
  })

  it('renders Hindi & Tamil output feature', () => {
    expect(screen.getByText(/hindi/i)).toBeInTheDocument()
  })

  it('renders Scheduled delivery feature', () => {
    expect(screen.getByText(/scheduled delivery/i)).toBeInTheDocument()
  })

  it('renders Predictable pricing feature', () => {
    expect(screen.getByText(/predictable pricing/i)).toBeInTheDocument()
  })
})
