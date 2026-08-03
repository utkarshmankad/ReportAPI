import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pricing } from "@/components/sections/Pricing";

describe("<Pricing />", () => {
  const originalLocation = window.location;
  const originalFetch = global.fetch;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  it("renders section heading", () => {
    render(<Pricing />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders all three plan names", () => {
    render(<Pricing />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Growth")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("shows monthly prices by default", () => {
    render(<Pricing />);
    expect(screen.getByText("$149")).toBeInTheDocument();
    expect(screen.getByText("$499")).toBeInTheDocument();
    expect(screen.getByText("$1,500")).toBeInTheDocument();
  });

  it("shows discounted prices when Annual is selected", async () => {
    render(<Pricing />);
    await userEvent.click(screen.getByRole("button", { name: /annual/i }));
    expect(screen.getByText("$119")).toBeInTheDocument();
    expect(screen.getByText("$399")).toBeInTheDocument();
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("switches back to monthly prices", async () => {
    render(<Pricing />);
    await userEvent.click(screen.getByRole("button", { name: /annual/i }));
    await userEvent.click(screen.getByRole("button", { name: /monthly/i }));
    expect(screen.getByText("$149")).toBeInTheDocument();
  });

  it("renders Most popular badge on Growth plan", () => {
    render(<Pricing />);
    expect(screen.getByText("Most popular")).toBeInTheDocument();
  });

  it("renders billing period toggle group", () => {
    render(<Pricing />);
    expect(screen.getByRole("group", { name: /billing period/i })).toBeInTheDocument();
  });

  it("renders Get started CTA buttons", () => {
    render(<Pricing />);
    const getStarted = screen.getAllByRole("button", { name: /get started/i });
    expect(getStarted.length).toBe(2);
  });

  it("renders Talk to us CTA for Enterprise", () => {
    render(<Pricing />);
    expect(screen.getByRole("button", { name: /talk to us/i })).toBeInTheDocument();
  });

  it("renders feature list items for Growth plan", () => {
    render(<Pricing />);
    expect(screen.getByText("PDF + PPTX export")).toBeInTheDocument();
    expect(screen.getByText("Webhook callbacks")).toBeInTheDocument();
  });

  it("renders Pricing badge", () => {
    render(<Pricing />);
    expect(screen.getByText(/pricing/i)).toBeInTheDocument();
  });

  it("redirects Enterprise CTA to /contact without calling checkout", async () => {
    global.fetch = jest.fn();
    render(<Pricing />);
    await userEvent.click(screen.getByRole("button", { name: /talk to us/i }));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(window.location.href).toBe("/contact");
  });

  it("redirects to /login when checkout returns 401", async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401, json: async () => ({}) });
    render(<Pricing />);
    const [starterCta] = screen.getAllByRole("button", { name: /get started/i });
    await userEvent.click(starterCta);
    await waitFor(() => expect(window.location.href).toBe("/login"));
  });

  it("redirects to Stripe checkout URL on success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ url: "https://checkout.stripe.com/session123" }),
    });
    render(<Pricing />);
    const [starterCta] = screen.getAllByRole("button", { name: /get started/i });
    await userEvent.click(starterCta);
    await waitFor(() =>
      expect(window.location.href).toBe("https://checkout.stripe.com/session123")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/checkout",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ plan: "starter", annual: false }),
      })
    );
  });
});
