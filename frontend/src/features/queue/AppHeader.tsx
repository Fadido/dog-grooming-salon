"use client";

import { Avatar, Button, Icon } from "@/design-system";

export function AppHeader({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-mark.svg" width={38} height={38} alt="פינוקי" />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--text-strong)" }}>
        פינוקי
      </span>
      <span style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={userName} tone="primary" size={36} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>שלום,</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>{userName}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" icon={<Icon name="log-out" size={16} />} onClick={onLogout}>
        התנתקות
      </Button>
    </header>
  );
}
