"use client";

import type { ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
  icon?: ReactNode;
}

/**
 * Dialog — centered modal over a dimmed overlay. RTL-aware.
 * Renders nothing when `open` is false.
 */
export function Dialog({ open, title, subtitle, onClose, children, footer, width = 460, icon = null }: DialogProps) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "var(--surface-overlay)",
        backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--space-5)",
        animation: "pkFade var(--dur-base) var(--ease-out)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width,
          maxHeight: "90vh", overflowY: "auto",
          background: "var(--surface-card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          animation: "pkPop var(--dur-slow) var(--ease-bounce)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "var(--space-6) var(--space-6) var(--space-4)" }}>
          {icon && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 44, height: 44, flex: "0 0 auto", borderRadius: "var(--radius-md)",
              background: "var(--color-primary-soft)", color: "var(--color-primary-press)", fontSize: 22,
            }}>{icon}</span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && <h3 style={{ fontSize: "var(--text-h3)", marginBottom: subtitle ? 4 : 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button" aria-label="סגירה" onClick={onClose} className="pk-iconbtn"
              style={{
                width: 34, height: 34, flex: "0 0 auto", border: "none",
                borderRadius: "var(--radius-md)", background: "var(--surface-sunken)",
                color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1,
              }}
            >✕</button>
          )}
        </div>

        <div style={{ padding: "0 var(--space-6)" }}>{children}</div>

        {footer && (
          <div style={{
            display: "flex", gap: "10px", justifyContent: "flex-start",
            padding: "var(--space-5) var(--space-6) var(--space-6)",
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
