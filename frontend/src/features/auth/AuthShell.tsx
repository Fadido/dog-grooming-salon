import type { ReactNode } from "react";

/** Shared centered card shell for the login / register screens. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        background:
          "radial-gradient(1100px 520px at 80% -10%, var(--coral-100), transparent 60%), var(--surface-app)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-mark.svg" width={64} height={64} alt="פינוקי" />
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 30, marginBottom: 4 }}>{title}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{subtitle}</p>
          </div>
        </div>
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-soft)",
            padding: "26px 24px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
