import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("<Badge />", () => {
  it("renders children", () => {
    render(<Badge variant="default">Hello</Badge>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge variant="default">Test</Badge>);
    const el = screen.getByText("Test");
    expect(el.tagName).toBe("SPAN");
  });

  it("default variant has surface-raised background class", () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default").className).toMatch(/bg-surface-raised/);
  });

  it("default variant has text-secondary class", () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default").className).toMatch(/text-text-secondary/);
  });

  it("success variant has success-subtle background class", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success").className).toMatch(/bg-success-subtle/);
  });

  it("success variant has text-success class", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success").className).toMatch(/text-success/);
  });

  it("has uppercase class applied", () => {
    render(<Badge variant="default">badge</Badge>);
    expect(screen.getByText("badge").className).toMatch(/uppercase/);
  });
});
