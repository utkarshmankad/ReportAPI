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

  it("renders Start for free CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("button", { name: /start for free/i })).toBeInTheDocument();
  });

  it("renders View docs CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("button", { name: /view docs/i })).toBeInTheDocument();
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
});
