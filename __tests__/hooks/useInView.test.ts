import { renderHook, render, screen, act } from "@testing-library/react";
import React from "react";
import { useInView } from "@/hooks/useInView";

function TestComponent() {
  const { ref, isInView } = useInView();
  return React.createElement("div", { ref }, isInView ? "visible" : "hidden");
}

describe("useInView()", () => {
  it("returns isInView=false initially when no DOM element is attached", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.isInView).toBe(false);
  });

  it("returns a ref object", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.ref).toBe("object");
  });

  it("sets isInView to true when the element intersects", () => {
    render(React.createElement(TestComponent));
    expect(screen.getByText("visible")).toBeInTheDocument();
  });

  it("creates an IntersectionObserver", () => {
    render(React.createElement(TestComponent));
    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it("disconnects observer when isInView becomes true", () => {
    const disconnectMock = jest.fn();
    (global.IntersectionObserver as jest.Mock).mockImplementationOnce((callback) => ({
      observe: jest.fn().mockImplementation((target) => {
        if (target) {
          callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            null as unknown as IntersectionObserver
          );
        }
      }),
      disconnect: disconnectMock,
      unobserve: jest.fn(),
    }));

    render(React.createElement(TestComponent));
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const disconnectMock = jest.fn();
    (global.IntersectionObserver as jest.Mock).mockImplementationOnce((callback) => ({
      observe: jest.fn().mockImplementation((target) => {
        if (target) {
          callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            null as unknown as IntersectionObserver
          );
        }
      }),
      disconnect: disconnectMock,
      unobserve: jest.fn(),
    }));

    const { unmount } = render(React.createElement(TestComponent));
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("does not call observe when ref is not attached to a DOM node", () => {
    const observeMock = jest.fn();
    (global.IntersectionObserver as jest.Mock).mockImplementationOnce((callback) => ({
      observe: observeMock,
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));

    renderHook(() => useInView());
    expect(observeMock).not.toHaveBeenCalled();
  });
});
