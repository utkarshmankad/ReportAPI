import "@testing-library/jest-dom";

global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn().mockImplementation((target) => {
    if (target) {
      callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        null as unknown as IntersectionObserver
      );
    }
  }),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
