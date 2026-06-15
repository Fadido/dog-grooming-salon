import type { CSSProperties, ReactNode } from "react";

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

/** EmptyState — friendly empty placeholder (e.g. "אין תורים עדיין"). */
export function EmptyState({ illustration = null, title, description, action = null, style }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        gap: "6px", padding: "var(--space-10) var(--space-6)",
        ...style,
      }}
    >
      {illustration && (
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 96, height: 96, marginBottom: "var(--space-3)",
          borderRadius: "50%", background: "var(--color-primary-tint)",
          color: "var(--color-primary)",
        }}>{illustration}</div>
      )}
      <h3 style={{ fontSize: "var(--text-h3)" }}>{title}</h3>
      {description && (
        <p style={{ fontSize: "var(--text-base)", color: "var(--text-muted)", maxWidth: 320 }}>{description}</p>
      )}
      {action && <div style={{ marginTop: "var(--space-4)" }}>{action}</div>}
    </div>
  );
}
