import '@testing-library/jest-dom'

// Global IntersectionObserver stub. Fires the callback synchronously when
// observe() is called so that useInView reaches isInView=true in jsdom.
// Individual test files (e.g. useInView.test.ts) override this in beforeEach.
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn().mockImplementation((target) => {
    if (target) {
      callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        null as unknown as IntersectionObserver
      )
    }
  }),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))
