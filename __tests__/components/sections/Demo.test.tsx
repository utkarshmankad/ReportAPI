import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Demo } from "@/components/sections/Demo";

describe("<Demo />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the section heading", () => {
    render(<Demo />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the textarea", () => {
    render(<Demo />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("textarea has correct aria-label", () => {
    render(<Demo />);
    expect(screen.getByLabelText(/paste your data here/i)).toBeInTheDocument();
  });

  it("Generate button is disabled initially", () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: /generate report/i })).toBeDisabled();
  });

  it("Generate button is enabled after typing", () => {
    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(screen.getByRole("button", { name: /generate report/i })).not.toBeDisabled();
  });

  it("Generate button is disabled for whitespace-only input", () => {
    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    expect(screen.getByRole("button", { name: /generate report/i })).toBeDisabled();
  });

  it("accepts JSON input without error", () => {
    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: '{"revenue": 100, "region": "North"}' },
    });
    expect(screen.getByRole("button", { name: /generate report/i })).not.toBeDisabled();
  });

  it("renders trust bullets", () => {
    render(<Demo />);
    expect(screen.getByText(/no account required/i)).toBeInTheDocument();
    expect(screen.getByText(/data is not stored/i)).toBeInTheDocument();
    expect(screen.getByText(/same api your customers/i)).toBeInTheDocument();
  });

  it("renders Live demo badge", () => {
    render(<Demo />);
    expect(screen.getByText(/live demo/i)).toBeInTheDocument();
  });

  it("shows loading state while fetching", async () => {
    let resolve: (value: unknown) => void;
    const promise = new Promise((res) => { resolve = res; });
    global.fetch = jest.fn().mockReturnValue(promise);

    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test data" } });
    fireEvent.click(screen.getByRole("button", { name: /generate report/i }));

    expect(await screen.findByRole("button", { name: /generating/i })).toBeInTheDocument();

    resolve!({ ok: true, json: async () => ({ narrative: "done" }) });
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /generating/i })).not.toBeInTheDocument()
    );
  });

  it("displays narrative after successful API call", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ narrative: "Strong Q2 performance." }),
    });

    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "region,revenue\nNorth,100" } });
    fireEvent.click(screen.getByRole("button", { name: /generate report/i }));

    await waitFor(() => {
      expect(screen.getByText("Strong Q2 performance.")).toBeInTheDocument();
    });
  });

  it("displays error message when API call fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue("Service unavailable"),
    });

    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "some data" } });
    fireEvent.click(screen.getByRole("button", { name: /generate report/i }));

    await waitFor(() => {
      expect(screen.getByText("ERROR")).toBeInTheDocument();
      expect(screen.getByText(/service unavailable/i)).toBeInTheDocument();
    });
  });

  it("does not show output area before generation", () => {
    render(<Demo />);
    expect(screen.queryByText("OUTPUT")).not.toBeInTheDocument();
  });

  it("shows OUTPUT label after successful call", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ narrative: "Test narrative result." }),
    });

    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /generate report/i }));

    await waitFor(() => {
      expect(screen.getByText("OUTPUT")).toBeInTheDocument();
    });
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

    render(<Demo />);
    const section = screen.getByRole("heading", { level: 2 }).closest("section");
    expect(section?.className).toMatch(/opacity-0/);
  });
});
