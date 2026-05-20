import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "dark", setTheme: jest.fn() })),
}));

describe("<Hero />", () => {
  it("renders the main heading", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("heading contains 'executive reports'", () => {
    render(<Hero />);
    expect(screen.getByText(/executive reports/i)).toBeInTheDocument();
  });

  it("renders Start for free CTA as a link", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /start for free/i })).toBeInTheDocument();
  });

  it("renders View docs CTA as a link", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /view docs/i })).toBeInTheDocument();
  });

  it("Start for free links to /contact", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /start for free/i })).toHaveAttribute("href", "/contact");
  });

  it("View docs links to /docs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /view docs/i })).toHaveAttribute("href", "/docs");
  });

  it("renders social proof text", () => {
    render(<Hero />);
    expect(screen.getByText(/120\+ companies/i)).toBeInTheDocument();
  });

  it("renders REQUEST code panel label", () => {
    render(<Hero />);
    expect(screen.getByText("REQUEST")).toBeInTheDocument();
  });

  it("renders RESPONSE code panel label", () => {
    render(<Hero />);
    expect(screen.getByText("RESPONSE")).toBeInTheDocument();
  });

  it("renders public beta badge", () => {
    render(<Hero />);
    expect(screen.getByText(/public beta/i)).toBeInTheDocument();
  });

  it("renders the API endpoint in code panel", () => {
    render(<Hero />);
    expect(screen.getByText(/\/v1\/report\/generate/i)).toBeInTheDocument();
  });

  it("renders POST verb in request code", () => {
    render(<Hero />);
    expect(screen.getByText("POST")).toBeInTheDocument();
  });

  it("renders with opacity-0 class when not in view", () => {
    // React 18 strict mode double-mounts, so queue two noop observers.
    // With observe never firing the callback, isInView stays false.
    const noopObserver = () => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    });
    (global.IntersectionObserver as jest.Mock).mockImplementationOnce(noopObserver);
    (global.IntersectionObserver as jest.Mock).mockImplementationOnce(noopObserver);

    render(<Hero />);
    const section = screen.getByRole("heading", { level: 1 }).closest("section");
    expect(section?.className).toMatch(/opacity-0/);
  });
});
