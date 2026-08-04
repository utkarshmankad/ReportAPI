import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WebhookManager } from "@/components/dashboard/WebhookManager";

describe("<WebhookManager />", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("shows empty state when there are no endpoints", () => {
    render(<WebhookManager initialEndpoints={[]} />);
    expect(screen.getByText(/no webhook endpoints yet/i)).toBeInTheDocument();
  });

  it("renders existing endpoints", () => {
    render(
      <WebhookManager
        initialEndpoints={[
          { id: "1", url: "https://example.com/hook", active: true, created_at: new Date().toISOString() },
        ]}
      />
    );
    expect(screen.getByText("https://example.com/hook")).toBeInTheDocument();
  });

  it("disables the add button when the url is empty", () => {
    render(<WebhookManager initialEndpoints={[]} />);
    expect(screen.getByRole("button", { name: /add endpoint/i })).toBeDisabled();
  });

  it("creates an endpoint and reveals the signing secret once", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        endpoint: { id: "2", url: "https://example.com/hook", active: true, created_at: new Date().toISOString() },
        secret: "whsec_full_secret",
      }),
    });

    render(<WebhookManager initialEndpoints={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/your-app.com/i), "https://example.com/hook");
    await userEvent.click(screen.getByRole("button", { name: /add endpoint/i }));

    await waitFor(() => expect(screen.getByText("whsec_full_secret")).toBeInTheDocument());
    expect(screen.getByText("https://example.com/hook")).toBeInTheDocument();
  });

  it("shows an error message when creation fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Webhook URL must use https." }),
    });

    render(<WebhookManager initialEndpoints={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/your-app.com/i), "http://example.com/hook");
    await userEvent.click(screen.getByRole("button", { name: /add endpoint/i }));

    await waitFor(() =>
      expect(screen.getByText("Webhook URL must use https.")).toBeInTheDocument()
    );
  });

  it("deletes an endpoint and removes it from the list", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(
      <WebhookManager
        initialEndpoints={[
          { id: "1", url: "https://example.com/hook", active: true, created_at: new Date().toISOString() },
        ]}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() =>
      expect(screen.queryByText("https://example.com/hook")).not.toBeInTheDocument()
    );
    expect(global.fetch).toHaveBeenCalledWith("/api/webhooks/1", { method: "DELETE" });
  });
});
