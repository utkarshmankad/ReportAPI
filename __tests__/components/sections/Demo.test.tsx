import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

    act(() => {
      screen.getByRole("button", { name: /generate report/i }).click();
    });

    expect(await screen.findByRole("button", { name: /generating/i })).toBeInTheDocument();
    resolve!({ ok: true, json: async () => ({ narrative: "done" }) });
  });

  it("displays narrative after successful API call", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ narrative: "Strong Q2 performance." }),
    });

    render(<Demo />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "region,revenue\nNorth,100" } });

    await act(async () => {
      screen.getByRole("button", { name: /generate report/i }).click();
    });

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

    await act(async () => {
      screen.getByRole("button", { name: /generate report/i }).click();
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
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

    await act(async () => {
      screen.getByRole("button", { name: /generate report/i }).click();
    });

    await waitFor(() => {
      expect(screen.getByText("OUTPUT")).toBeInTheDocument();
    });
  });
});
