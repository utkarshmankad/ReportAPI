import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/sections/Hero'

describe('<Hero />', () => {
  beforeEach(() => render(<Hero />))

  it('renders the beta badge', () => {
    expect(screen.getByText(/now in public beta/i)).toBeInTheDocument()
  })

  it('renders the h1 headline', () => {
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('h1 contains the word "executive"', () => {
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/executive/i)
  })

  it('renders the subheadline paragraph', () => {
    expect(screen.getByText(/no bi analyst required/i)).toBeInTheDocument()
  })

  it('renders the primary CTA', () => {
    expect(screen.getByRole('button', { name: /start for free/i })).toBeInTheDocument()
  })

  it('renders the ghost CTA', () => {
    expect(screen.getByRole('button', { name: /view docs/i })).toBeInTheDocument()
  })

  it('renders social proof text', () => {
    expect(screen.getByText(/120\+ companies/i)).toBeInTheDocument()
  })

  it('renders REQUEST label in code preview', () => {
    expect(screen.getByText('REQUEST')).toBeInTheDocument()
  })

  it('renders RESPONSE label in code preview', () => {
    expect(screen.getByText('RESPONSE')).toBeInTheDocument()
  })
})
