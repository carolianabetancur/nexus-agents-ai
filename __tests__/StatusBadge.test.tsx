import { render, screen } from "@testing-library/react";
import {
  StatusBadge,
  STATUS_CONFIG,
} from "@/modules/agents/components/StatusBadge";

describe("StatusBadge", () => {
  const cases = [
    ["active", "Active"],
    ["inactive", "Inactive"],
    ["training", "Training"],
    ["deprecated", "Deprecated"],
  ] as const;

  it.each(cases)("renders correct label for %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("renders outer span container", () => {
    const { container } = render(<StatusBadge status="active" />);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("renders indicator dot", () => {
    const { container } = render(<StatusBadge status="active" />);
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBe(2);
  });

  it.each(Object.entries(STATUS_CONFIG))(
    "applies correct styles for %s",
    (status, cfg) => {
      const { container } = render(<StatusBadge status={status as any} />);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveStyle(`color: ${cfg.color}`);
      expect(badge).toHaveStyle(`background: ${cfg.bg}`);
      expect(badge).toHaveStyle(`border: 1px solid ${cfg.border}`);

      const dot = badge.querySelector("span") as HTMLElement;
      expect(dot).toHaveStyle(`background: ${cfg.color}`);
    },
  );

  it("falls back to inactive when unknown status is provided", () => {
    const { container } = render(<StatusBadge status={"unknown" as any} />);

    const badge = container.firstChild as HTMLElement;
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    const cfg = STATUS_CONFIG.inactive;
    expect(badge).toHaveStyle(`color: ${cfg.color}`);
  });

  it("exports STATUS_CONFIG correctly", () => {
    expect(STATUS_CONFIG.active.label).toBe("Active");
    expect(STATUS_CONFIG.training.label).toBe("Training");
    expect(STATUS_CONFIG.deprecated.label).toBe("Deprecated");
  });
});
