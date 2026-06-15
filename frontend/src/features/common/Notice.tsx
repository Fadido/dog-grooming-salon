import type { ReactNode } from "react";
import { Icon } from "@/design-system";

type Tone = "danger" | "success" | "warning" | "info";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  danger: { bg: "var(--status-danger-bg)", fg: "var(--status-danger-fg)" },
  success: { bg: "var(--status-success-bg)", fg: "var(--status-success-fg)" },
  warning: { bg: "var(--status-warning-bg)", fg: "var(--status-warning-fg)" },
  info: { bg: "var(--status-info-bg)", fg: "var(--status-info-fg)" },
};

/** Small inline status banner (errors, loyalty discount, same-day note). */
export function Notice({
  tone = "info",
  icon = "info",
  children,
  style,
}: {
  tone?: Tone;
  icon?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const t = TONES[tone];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        background: t.bg,
        color: t.fg,
        borderRadius: "var(--radius-md)",
        padding: "10px 13px",
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
        ...style,
      }}
    >
      <span style={{ display: "inline-flex", flex: "0 0 auto", marginTop: 1 }}>
        <Icon name={icon} size={17} />
      </span>
      {/* `pre-line` turns the "\n"-joined validation messages into separate lines. */}
      <span style={{ whiteSpace: "pre-line" }}>{children}</span>
    </div>
  );
}
