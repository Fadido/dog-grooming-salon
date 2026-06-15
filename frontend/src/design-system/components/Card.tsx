"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Variant = "raised" | "flat" | "sunken" | "mine";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: Variant;
  padding?: string;
  interactive?: boolean;
}

/** Card — rounded white surface with a soft shadow. */
export function Card({ children, variant = "raised", padding = "var(--space-6)", interactive = false, onClick, style, ...rest }: CardProps) {
  const variants: Record<Variant, CSSProperties> = {
    raised: { background: "var(--surface-card)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)" },
    flat: { background: "var(--surface-card)", border: "1px solid var(--border-default)", boxShadow: "none" },
    sunken: { background: "var(--surface-sunken)", border: "1px solid transparent", boxShadow: "none" },
    mine: { background: "var(--surface-mine)", border: "1.5px solid var(--surface-mine-edge)", boxShadow: "var(--shadow-sm)" },
  };
  const v = variants[variant] || variants.raised;

  return (
    <div
      onClick={onClick}
      className={interactive ? "pk-row--clickable" : undefined}
      style={{
        borderRadius: "var(--radius-lg)",
        padding,
        cursor: interactive ? "pointer" : "default",
        transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
