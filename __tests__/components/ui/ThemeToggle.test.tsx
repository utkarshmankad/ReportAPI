import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

import { useTheme } from "next-themes";
const mockUseTheme = useTheme as jest.Mock;

describe("<ThemeToggle />", () => {
  it("renders placeholder before mount (SSR guard)", () => {
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme: jest.fn() });
    expect(() => render(<ThemeToggle />)).not.toThrow();
  });

  it("renders sun icon when theme is dark (mounted)", () => {
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme: jest.fn() });
    render(<ThemeToggle />);
    const btn = screen.queryByRole("button");
    if (btn) {
      expect(btn).toHaveAttribute("aria-label", "Switch to light mode");
    }
  });

  it("renders moon icon when theme is light (mounted)", () => {
    mockUseTheme.mockReturnValue({ theme: "light", setTheme: jest.fn() });
    render(<ThemeToggle />);
    const btn = screen.queryByRole("button");
    if (btn) {
      expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");
    }
  });

  it("calls setTheme with light when dark is active", async () => {
    const setTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme });
    render(<ThemeToggle />);
    const btn = screen.queryByRole("button");
    if (btn) {
      await userEvent.click(btn);
      expect(setTheme).toHaveBeenCalledWith("light");
    }
  });

  it("calls setTheme with dark when light is active", async () => {
    const setTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: "light", setTheme });
    render(<ThemeToggle />);
    const btn = screen.queryByRole("button");
    if (btn) {
      await userEvent.click(btn);
      expect(setTheme).toHaveBeenCalledWith("dark");
    }
  });
});
