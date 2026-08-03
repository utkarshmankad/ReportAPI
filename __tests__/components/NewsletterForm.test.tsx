import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "@/components/NewsletterForm";

describe("<NewsletterForm />", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("renders the email input and subscribe button", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("shows a success message after subscribing", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => expect(screen.getByText(/you're subscribed/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/newsletter",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "test@example.com" }) })
    );
  });

  it("shows an error message when the request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Please enter a valid email address." }),
    });

    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() =>
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument()
    );
  });

  it("shows a generic error when the request throws", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => expect(screen.getByText("Failed to subscribe.")).toBeInTheDocument());
  });
});
