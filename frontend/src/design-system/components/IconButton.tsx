"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Tone = "neutral" | "primary" | "danger";
type Variant = "ghost" | "soft" | "solid";
type Size = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  children?: ReactNode;
  label?: string;
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  title?: string;
}

/**
 * IconButton — square icon-only button (edit, delete, close, etc).
 */
export function IconButton({
  children,
  label,
  tone = "neutral",
  variant = "ghost",
  size = "md",
  disabled = false,
  title,
  onClick,
  style,
  ...rest
}: IconButtonProps) {
  const sizes: Record<Size, number> = { sm: 32, md: 40, lg: 44 };
  const dim = sizes[size];

  const toneColors: Record<Tone, { fg: string; soft: string; solid: string }> = {
    neutral: { fg: "var(--text-muted)", soft: "var(--surface-sunken)", solid: "var(--sand-600)" },
    primary: { fg: "var(--color-primary)", soft: "var(--color-primary-soft)", solid: "var(--color-primary)" },
    danger: { fg: "var(--status-danger-fg)", soft: "var(--status-danger-bg)", solid: "var(--red-500)" },
  };
  const t = toneColors[tone] || toneColors.neutral;

  let bg = "transparent";
  let fg = t.fg;
  if (variant === "soft") bg = t.soft;
  if (variant === "solid") { bg = t.solid; fg = "var(--white)"; }

  const fontSize: CSSProperties["fontSize"] = size === "sm" ? 16 : 19;

  return (
    <button
      type="button"
      aria-label={label || title}
      title={title || label}
      disabled={disabled}
      onClick={onClick}
      className="pk-iconbtn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        flex: "0 0 auto",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: bg,
        color: fg,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.92)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      <span style={{ display: "inline-flex", width: "1.25em", height: "1.25em", fontSize }}>{children}</span>
    </button>
  );
}
