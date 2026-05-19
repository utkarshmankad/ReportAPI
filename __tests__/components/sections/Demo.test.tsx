import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Demo } from '@/components/sections/Demo'

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<Demo />', () => {
  it('renders section with id="demo"', () => {
    render(<Demo />)
    expect(document.getElementById('demo')).toBeInTheDocument()
  })

  it('renders the textarea with correct aria-label', () => {
    render(<Demo />)
    expect(screen.getByRole('textbox', { name: /paste your data/i })).toBeInTheDocument()
  })

  it('renders the Generate button', () => {
    render(<Demo />)
    expect(screen.getByRole('button', { name: /generate report/i })).toBeInTheDocument()
  })

  it('output area is hidden initially', () => {
    render(<Demo />)
    expect(screen.queryByText('OUTPUT')).not.toBeInTheDocument()
  })

  it('disables button and shows loading text while fetching', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))
    render(<Demo />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /paste your data/i }),
      { target: { value: '[{"revenue": 100}]' } }
    )
    await userEvent.click(screen.getByRole('button', { name: /generate report/i }))
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled()
  })

  it('displays narrative on successful API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ narrative: 'Revenue grew 18% YoY.' }),
    })
    render(<Demo />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /paste your data/i }),
      { target: { value: '[{"revenue": 100}]' } }
    )
    await userEvent.click(screen.getByRole('button', { name: /generate report/i }))
    await waitFor(() => {
      expect(screen.getByText('Revenue grew 18% YoY.')).toBeInTheDocument()
    })
  })

  it('displays error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Unauthorized' }),
    })
    render(<Demo />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /paste your data/i }),
      { target: { value: '[{"revenue": 100}]' } }
    )
    await userEvent.click(screen.getByRole('button', { name: /generate report/i }))
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('shows OUTPUT label after response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ narrative: 'Q3 summary complete.' }),
    })
    render(<Demo />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /paste your data/i }),
      { target: { value: '[{"val": 1}]' } }
    )
    await userEvent.click(screen.getByRole('button', { name: /generate report/i }))
    await waitFor(() => {
      expect(screen.getByText('OUTPUT')).toBeInTheDocument()
    })
  })

  it('renders trust bullets', () => {
    render(<Demo />)
    expect(screen.getByText(/no account required/i)).toBeInTheDocument()
    expect(screen.getByText(/data is not stored/i)).toBeInTheDocument()
  })
})
