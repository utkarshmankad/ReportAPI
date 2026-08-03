import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocsSearch } from "@/components/docs/DocsSearch";

const entries = [
  { label: "Introduction", href: "#introduction", heading: "Getting Started" },
  { label: "Authentication", href: "#authentication", heading: "Getting Started" },
  { label: "Interactive API Reference", href: "/docs/api-reference", heading: "API Reference" },
];

describe("<DocsSearch />", () => {
  it("shows no results dropdown when query is empty", () => {
    render(<DocsSearch entries={entries} />);
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
  });

  it("filters entries matching the query by label", async () => {
    render(<DocsSearch entries={entries} />);
    const input = screen.getByPlaceholderText(/search docs/i);
    await userEvent.type(input, "auth");
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.queryByText("Introduction")).not.toBeInTheDocument();
  });

  it("filters entries matching the query by heading", async () => {
    render(<DocsSearch entries={entries} />);
    const input = screen.getByPlaceholderText(/search docs/i);
    await userEvent.type(input, "api reference");
    expect(screen.getByText("Interactive API Reference")).toBeInTheDocument();
  });

  it("shows a no-results message when nothing matches", async () => {
    render(<DocsSearch entries={entries} />);
    const input = screen.getByPlaceholderText(/search docs/i);
    await userEvent.type(input, "nonexistent-topic-xyz");
    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });

  it("renders each result as a link with the correct href", async () => {
    render(<DocsSearch entries={entries} />);
    const input = screen.getByPlaceholderText(/search docs/i);
    await userEvent.type(input, "introduction");
    expect(screen.getByRole("link", { name: /introduction/i })).toHaveAttribute(
      "href",
      "#introduction"
    );
  });
});
