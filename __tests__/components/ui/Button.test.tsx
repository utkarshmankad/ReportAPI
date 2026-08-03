import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("<Button />", () => {
  it("renders children", () => {
    render(<Button variant="primary" size="md">Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("has type=button by default", () => {
    render(<Button variant="primary" size="md">Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("applies sm size padding class", () => {
    render(<Button variant="primary" size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toMatch(/px-3/);
  });

  it("applies md size padding class", () => {
    render(<Button variant="primary" size="md">Medium</Button>);
    expect(screen.getByRole("button").className).toMatch(/px-4/);
  });

  it("applies lg size padding class", () => {
    render(<Button variant="primary" size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toMatch(/px-6/);
  });

  it("merges custom className", () => {
    render(<Button variant="primary" size="md" className="custom-class">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders as disabled", () => {
    render(<Button variant="primary" size="md" disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" size="md" onClick={handleClick}>Click</Button>);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" size="md" disabled onClick={handleClick}>Click</Button>);
    screen.getByRole("button").click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("ghost variant uses border class", () => {
    render(<Button variant="ghost" size="md">Ghost</Button>);
    expect(screen.getByRole("button").className).toMatch(/border/);
  });

  it("primary variant has accent background class", () => {
    render(<Button variant="primary" size="md">Test</Button>);
    expect(screen.getByRole("button").className).toMatch(/bg-accent/);
  });

  it("ghost variant has transparent background", () => {
    render(<Button variant="ghost" size="md">Test</Button>);
    expect(screen.getByRole("button").className).toMatch(/bg-transparent/);
  });

  it("renders as a link when href is provided", () => {
    render(<Button variant="primary" size="md" href="/test">Go there</Button>);
    const link = screen.getByRole("link", { name: /go there/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("link variant applies same visual classes as button", () => {
    render(<Button variant="primary" size="md" href="/test">Link</Button>);
    expect(screen.getByRole("link").className).toMatch(/bg-accent/);
  });
});
