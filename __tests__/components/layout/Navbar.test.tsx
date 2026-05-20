import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/layout/Navbar";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "dark", setTheme: jest.fn() })),
}));

describe("<Navbar />", () => {
  it("renders the brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("ReportAPI")).toBeInTheDocument();
  });

  it("renders nav with aria-label", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("renders Features nav link", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
  });

  it("renders Pricing nav link", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
  });

  it("renders Docs nav link", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /docs/i })).toBeInTheDocument();
  });

  it("renders the Get API key CTA button", () => {
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /get api key/i })).toBeInTheDocument();
  });

  it("renders the ThemeToggle", () => {
    render(<Navbar />);
    const btn = screen.queryByRole("button", { name: /switch to/i });
    expect(btn || document.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("Features link points to #features", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute("href", "#features");
  });

  it("Pricing link points to #pricing", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute("href", "#pricing");
  });
});
