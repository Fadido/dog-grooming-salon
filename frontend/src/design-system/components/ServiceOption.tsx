"use client";

import type { CSSProperties, ReactNode } from "react";

export interface ServiceOptionProps {
  title: string;
  duration: string;
  price: string;
  discountPrice?: string | null;
  selected?: boolean;
  icon?: ReactNode;
  onSelect?: () => void;
  style?: CSSProperties;
}

/**
 * ServiceOption — selectable radio card for a grooming service tier
 * (size, duration, price). Shows a struck original price when a
 * loyalty discount applies.
 */
export function ServiceOption({
  title,
  duration,
  price,
  discountPrice = null,
  selected = false,
  icon = null,
  onSelect,
  style,
}: ServiceOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="pk-service"
      aria-pressed={selected}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        textAlign: "start",
        padding: "14px 16px",
        background: selected ? "var(--color-primary-tint)" : "var(--surface-card)",
        border: `1.5px solid ${selected ? "var(--color-primary)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      <span
        style={{
          width: 20, height: 20, flex: "0 0 auto", borderRadius: "50%",
          border: `2px solid ${selected ? "var(--color-primary)" : "var(--border-strong)"}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {selected && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary)" }} />}
      </span>

      {icon && (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 38, height: 38, borderRadius: "var(--radius-sm)",
          background: "var(--color-accent-soft)", color: "var(--teal-700)", fontSize: 20,
        }}>{icon}</span>
      )}

      <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)" as unknown as number, fontSize: "var(--text-base)", color: "var(--text-strong)" }}>
          {title}
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{duration}</span>
      </span>

      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }} className="ltr-nums">
        {discountPrice != null && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-subtle)", textDecoration: "line-through" }}>
            {price}
          </span>
        )}
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)" as unknown as number, fontSize: "var(--text-lg)",
          color: discountPrice != null ? "var(--color-primary)" : "var(--text-strong)",
        }}>
          {discountPrice != null ? discountPrice : price}
        </span>
      </span>
    </button>
  );
}
