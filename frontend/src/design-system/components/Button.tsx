"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Button — primary call-to-action button for פינוקי.
 * Variants: primary (coral), secondary (teal), soft, ghost, danger.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconAfter = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const heights: Record<Size, string> = { sm: "var(--control-sm)", md: "var(--control-md)", lg: "var(--control-lg)" };
  const fonts: Record<Size, string> = { sm: "var(--text-sm)", md: "var(--text-base)", lg: "var(--text-lg)" };
  const pads: Record<Size, string> = { sm: "0 16px", md: "0 22px", lg: "0 28px" };

  const palettes: Record<Variant, CSSProperties> = {
    primary: { background: "var(--color-primary)", color: "var(--color-on-primary)", border: "1px solid transparent", boxShadow: "var(--shadow-primary)" },
    secondary: { background: "var(--color-accent)", color: "var(--color-on-accent)", border: "1px solid transparent", boxShadow: "0 8px 20px rgba(60,151,136,0.26)" },
    soft: { background: "var(--color-primary-soft)", color: "var(--color-primary-press)", border: "1px solid transparent", boxShadow: "none" },
    ghost: { background: "transparent", color: "var(--text-body)", border: "1px solid var(--border-default)", boxShadow: "none" },
    danger: { background: "var(--status-danger-bg)", color: "var(--status-danger-fg)", border: "1px solid transparent", boxShadow: "none" },
  };

  const p = palettes[variant] || palettes.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`pk-btn pk-btn--${variant}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        height: heights[size],
        padding: pads[size],
        width: fullWidth ? "100%" : "auto",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-semibold)" as unknown as number,
        fontSize: fonts[size],
        lineHeight: 1,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...p,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex", width: "1.15em", height: "1.15em" }}>{icon}</span>}
      {children}
      {iconAfter && <span style={{ display: "inline-flex", width: "1.15em", height: "1.15em" }}>{iconAfter}</span>}
    </button>
  );
}
