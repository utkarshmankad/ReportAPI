import { renderHook, act } from '@testing-library/react'
import { useInView } from '@/hooks/useInView'

const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let intersectionCallback: IntersectionObserverCallback

beforeEach(() => {
  jest.clearAllMocks()
  window.IntersectionObserver = jest.fn((cb) => {
    intersectionCallback = cb
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }
  }) as unknown as typeof IntersectionObserver
})

describe('useInView()', () => {
  it('returns isInView=false initially', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current.isInView).toBe(false)
  })

  it('returns a ref object', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current.ref).toBeDefined()
    expect(typeof result.current.ref).toBe('object')
  })

  it('sets isInView=true when intersection fires', () => {
    const { result } = renderHook(() => useInView())
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(result.current.isInView).toBe(true)
  })

  it('does not revert to false after becoming true (triggerOnce)', () => {
    const { result } = renderHook(() => useInView())
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(result.current.isInView).toBe(true)
  })

  it('calls disconnect on unmount', () => {
    const { unmount } = renderHook(() => useInView())
    unmount()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
