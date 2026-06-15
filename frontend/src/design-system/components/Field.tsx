import type { CSSProperties, ReactNode } from "react";

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/** Field — label + helper/error wrapper for a form control. */
export function Field({ label, htmlFor, hint, error, required = false, children, style }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: "var(--weight-semibold)" as unknown as number,
            fontSize: "var(--text-sm)",
            color: "var(--text-body)",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--color-primary)", marginInlineStart: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error
        ? <span style={{ fontSize: "var(--text-xs)", color: "var(--status-danger-fg)" }}>{error}</span>
        : hint
          ? <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{hint}</span>
          : null}
    </div>
  );
}
