"use client";

import type { CSSProperties, SelectHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: Size;
  invalid?: boolean;
  children?: ReactNode;
}

/** Select — native dropdown styled to match Input, with a chevron. */
export function Select({ size = "md", invalid = false, disabled = false, children, style, ...rest }: SelectProps) {
  const heights: Record<Size, string> = { sm: "var(--control-sm)", md: "var(--control-md)", lg: "var(--control-lg)" };
  const wrapper: CSSProperties = { position: "relative", ...style };
  return (
    <div style={wrapper}>
      <select
        disabled={disabled}
        className="pk-select"
        style={{
          width: "100%",
          height: heights[size],
          padding: "0 14px 0 38px",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          color: "var(--text-body)",
          background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
          border: `1.5px solid ${invalid ? "var(--status-danger-fg)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-md)",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
        {...rest}
      >
        {children}
      </select>
      <span
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
          fontSize: 12,
        }}
      >
        ▾
      </span>
    </div>
  );
}
