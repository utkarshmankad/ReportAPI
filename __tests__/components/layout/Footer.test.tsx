import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

describe("<Footer />", () => {
  it("renders brand name", () => {
    render(<Footer />);
    expect(screen.getByText("ReportAPI")).toBeInTheDocument();
  });

  it("renders tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/raw data in/i)).toBeInTheDocument();
  });

  it("renders Product column heading", () => {
    render(<Footer />);
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("renders Company column heading", () => {
    render(<Footer />);
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("renders Legal column heading", () => {
    render(<Footer />);
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders Features link", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link", { name: /features/i });
    expect(links.length).toBeGreaterThan(0);
  });

  it("renders Privacy Policy link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toBeInTheDocument();
  });

  it("renders DPDP Compliance link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /dpdp compliance/i })).toBeInTheDocument();
  });

  it("renders copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/2026 reportapi/i)).toBeInTheDocument();
  });

  it("renders the built for india tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/built for india/i)).toBeInTheDocument();
  });
});
