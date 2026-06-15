"use client";

import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: ReactNode;
  size?: Size;
  invalid?: boolean;
}

/** Input — text / password / date / time field with optional leading icon. */
export function Input({
  type = "text",
  icon = null,
  size = "md",
  invalid = false,
  disabled = false,
  style,
  ...rest
}: InputProps) {
  const heights: Record<Size, string> = { sm: "var(--control-sm)", md: "var(--control-md)", lg: "var(--control-lg)" };

  const input = (
    <input
      type={type}
      disabled={disabled}
      className="pk-input"
      style={{
        width: "100%",
        height: heights[size],
        padding: icon ? "0 44px 0 14px" : "0 14px",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-base)",
        color: "var(--text-body)",
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border: `1.5px solid ${invalid ? "var(--status-danger-fg)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        opacity: disabled ? 0.6 : 1,
        ...(icon ? {} : style),
      }}
      {...rest}
    />
  );

  if (!icon) return input;

  const wrapper: CSSProperties = { position: "relative", ...style };

  return (
    <div style={wrapper}>
      <span
        style={{
          position: "absolute",
          insetInlineStart: 14,
          top: "50%",
          transform: "translateY(-50%)",
          display: "inline-flex",
          width: 18,
          height: 18,
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>
      {input}
    </div>
  );
}
