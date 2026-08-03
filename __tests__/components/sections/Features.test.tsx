import { render, screen } from "@testing-library/react";
import { Features } from "@/components/sections/Features";

describe("<Features />", () => {
  it("renders section heading", () => {
    render(<Features />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("heading contains 'One API call'", () => {
    render(<Features />);
    expect(screen.getByText(/one api call/i)).toBeInTheDocument();
  });

  it("renders 'How it works' badge", () => {
    render(<Features />);
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
  });

  it("renders all three step numbers", () => {
    render(<Features />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders Send data step", () => {
    render(<Features />);
    expect(screen.getByText("Send data")).toBeInTheDocument();
  });

  it("renders Template applied step", () => {
    render(<Features />);
    expect(screen.getByText("Template applied")).toBeInTheDocument();
  });

  it("renders Receive narrative step", () => {
    render(<Features />);
    expect(screen.getByText("Receive narrative")).toBeInTheDocument();
  });

  it("renders Sub-4s latency feature", () => {
    render(<Features />);
    expect(screen.getByText("Sub-4s latency")).toBeInTheDocument();
  });

  it("renders PII guard feature", () => {
    render(<Features />);
    expect(screen.getByText(/pii guard/i)).toBeInTheDocument();
  });

  it("renders all 6 feature titles", () => {
    render(<Features />);
    const featureTitles = [
      "Sub-4s latency",
      "PII guard built in",
      "Template system",
      "Hindi & Tamil output",
      "Scheduled delivery",
      "Predictable pricing",
    ];
    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
