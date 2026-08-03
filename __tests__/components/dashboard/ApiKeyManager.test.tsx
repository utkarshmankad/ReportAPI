import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager";

describe("<ApiKeyManager />", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("shows empty state when there are no keys", () => {
    render(<ApiKeyManager initialKeys={[]} />);
    expect(screen.getByText("No API keys yet.")).toBeInTheDocument();
  });

  it("renders existing keys with their prefix", () => {
    render(
      <ApiKeyManager
        initialKeys={[
          {
            id: "1",
            name: "prod",
            key_prefix: "rpk_abc123",
            created_at: new Date().toISOString(),
            revoked_at: null,
          },
        ]}
      />
    );
    expect(screen.getByText("prod")).toBeInTheDocument();
    expect(screen.getByText("rpk_abc123…")).toBeInTheDocument();
  });

  it("shows revoked label and hides Revoke button for revoked keys", () => {
    render(
      <ApiKeyManager
        initialKeys={[
          {
            id: "1",
            name: "old",
            key_prefix: "rpk_old",
            created_at: new Date().toISOString(),
            revoked_at: new Date().toISOString(),
          },
        ]}
      />
    );
    expect(screen.getByText("revoked")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /revoke/i })).not.toBeInTheDocument();
  });

  it("creates a key and reveals the raw key once", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        key: { id: "2", name: "new key", key_prefix: "rpk_newk", created_at: new Date().toISOString() },
        rawKey: "rpk_newkey_full_secret",
      }),
    });

    render(<ApiKeyManager initialKeys={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/key name/i), "new key");
    await userEvent.click(screen.getByRole("button", { name: /create key/i }));

    await waitFor(() =>
      expect(screen.getByText("rpk_newkey_full_secret")).toBeInTheDocument()
    );
    expect(screen.getByText("new key")).toBeInTheDocument();
  });

  it("does not create a key when name is empty", async () => {
    global.fetch = jest.fn();
    render(<ApiKeyManager initialKeys={[]} />);
    expect(screen.getByRole("button", { name: /create key/i })).toBeDisabled();
  });

  it("revokes a key and updates its state", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(
      <ApiKeyManager
        initialKeys={[
          {
            id: "1",
            name: "prod",
            key_prefix: "rpk_abc123",
            created_at: new Date().toISOString(),
            revoked_at: null,
          },
        ]}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /revoke/i }));

    await waitFor(() => expect(screen.getByText("revoked")).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith("/api/keys/1", { method: "DELETE" });
  });
});
