import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pricing } from '@/components/sections/Pricing'

describe('<Pricing />', () => {
  beforeEach(() => render(<Pricing />))

  it('renders section with id="pricing"', () => {
    expect(document.getElementById('pricing')).toBeInTheDocument()
  })

  it('renders all three tier names', () => {
    expect(screen.getByText(/starter/i)).toBeInTheDocument()
    expect(screen.getByText(/growth/i)).toBeInTheDocument()
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument()
  })

  it('renders monthly prices by default', () => {
    expect(screen.getByText('$149')).toBeInTheDocument()
    expect(screen.getByText('$499')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('renders the Most popular badge on Growth card', () => {
    expect(screen.getByText(/most popular/i)).toBeInTheDocument()
  })

  it('switches to annual pricing when Annual toggle clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('$119')).toBeInTheDocument()
    expect(screen.getByText('$399')).toBeInTheDocument()
  })

  it('annual Starter price is 20% less than monthly (rounded)', async () => {
    await userEvent.click(screen.getByRole('button', { name: /annual/i }))
    expect(screen.getByText('$119')).toBeInTheDocument()
  })

  it('switches back to monthly when Monthly toggle clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: /annual/i }))
    await userEvent.click(screen.getByRole('button', { name: /monthly/i }))
    expect(screen.getByText('$149')).toBeInTheDocument()
  })

  it('renders CTA buttons for each tier', () => {
    const buttons = screen.getAllByRole('button', { name: /get started|talk to us/i })
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('billing toggle has aria role group', () => {
    expect(screen.getByRole('group', { name: /billing period/i })).toBeInTheDocument()
  })
})
