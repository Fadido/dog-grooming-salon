import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  solid?: boolean;
}

/** Badge — small status / category pill. */
export function Badge({ children, tone = "neutral", icon = null, solid = false, style, ...rest }: BadgeProps) {
  const tones: Record<Tone, { bg: string; fg: string; solidBg: string }> = {
    neutral: { bg: "var(--surface-sunken)", fg: "var(--text-muted)", solidBg: "var(--sand-600)" },
    primary: { bg: "var(--color-primary-soft)", fg: "var(--color-primary-press)", solidBg: "var(--color-primary)" },
    accent: { bg: "var(--color-accent-soft)", fg: "var(--teal-700)", solidBg: "var(--color-accent)" },
    success: { bg: "var(--status-success-bg)", fg: "var(--status-success-fg)", solidBg: "var(--green-500)" },
    warning: { bg: "var(--status-warning-bg)", fg: "var(--status-warning-fg)", solidBg: "var(--amber-500)" },
    danger: { bg: "var(--status-danger-bg)", fg: "var(--status-danger-fg)", solidBg: "var(--red-500)" },
    info: { bg: "var(--status-info-bg)", fg: "var(--status-info-fg)", solidBg: "var(--blue-500)" },
  };
  const t = tones[tone] || tones.neutral;

  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: 26,
    padding: "0 11px",
    borderRadius: "var(--radius-pill)",
    background: solid ? t.solidBg : t.bg,
    color: solid ? "var(--white)" : t.fg,
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-semibold)" as unknown as number,
    fontSize: "var(--text-xs)",
    lineHeight: 1,
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <span style={css} {...rest}>
      {icon && <span style={{ display: "inline-flex", width: "1.05em", height: "1.05em" }}>{icon}</span>}
      {children}
    </span>
  );
}
