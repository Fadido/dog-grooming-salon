"use client";

import { useState } from "react";
import { AppointmentRow, Button, EmptyState, Input, Icon } from "@/design-system";
import { AppHeader } from "./AppHeader";
import type { AppointmentQueueDto } from "@/lib/types";
import { arrivalLabel, currency, dogTypeLabel, parseServerDate, toDateInput } from "@/lib/format";

interface QueueScreenProps {
  userName: string;
  appointments: AppointmentQueueDto[];
  onLogout: () => void;
  onAdd: () => void;
  onOpen: (a: AppointmentQueueDto) => void;
  onEdit: (a: AppointmentQueueDto) => void;
  onDelete: (a: AppointmentQueueDto) => void;
}

export function QueueScreen({ userName, appointments, onLogout, onAdd, onOpen, onEdit, onDelete }: QueueScreenProps) {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = appointments.filter((a) => {
    if (search && !a.customerFirstName.includes(search.trim())) return false;
    const date = toDateInput(parseServerDate(a.scheduledTime));
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });

  const mineCount = appointments.filter((a) => a.isMine).length;
  const hasFilter = Boolean(search || from || to);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-app)" }}>
      <AppHeader userName={userName} onLogout={onLogout} />

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "26px 22px 60px" }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 30, marginBottom: 6 }}>התור לתספורת</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              <span className="ltr-nums">{appointments.length}</span> לקוחות ממתינים ·{" "}
              <span className="ltr-nums">{mineCount}</span> תורים שלך
            </p>
          </div>
          <Button size="lg" icon={<Icon name="plus" />} onClick={onAdd}>הוספת תור חדש</Button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end",
            background: "var(--surface-card)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-lg)", padding: 14, marginBottom: 18, boxShadow: "var(--shadow-xs)",
          }}
        >
          <label style={{ flex: "2 1 220px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>חיפוש לפי שם לקוח</span>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="הקלידו שם…" icon={<Icon name="search" />} />
          </label>
          <label style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>מתאריך</span>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>עד תאריך</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          {hasFilter && (
            <Button variant="ghost" size="md" onClick={() => { setSearch(""); setFrom(""); setTo(""); }}>ניקוי</Button>
          )}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)" }}>
            <EmptyState
              illustration={<Icon name={appointments.length === 0 ? "calendar-heart" : "search-x"} size={42} />}
              title={appointments.length === 0 ? "אין תורים עדיין" : "לא נמצאו תורים"}
              description={appointments.length === 0
                ? "הוסיפו את התור הראשון לתור לתספורת ונתחיל לפנק 🐾"
                : "נסו לשנות את החיפוש או טווח התאריכים"}
              action={appointments.length === 0
                ? <Button icon={<Icon name="plus" />} onClick={onAdd}>הוספת תור חדש</Button>
                : undefined}
            />
          </div>
        ) : (
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            {filtered.map((a, idx) => (
              <AppointmentRow
                key={a.id}
                name={a.customerFirstName}
                arrival={arrivalLabel(a.scheduledTime)}
                dogType={dogTypeLabel(a.dogType)}
                price={currency(a.finalPrice)}
                mine={a.isMine}
                discounted={a.discountApplied}
                canEdit={a.canEdit}
                canDelete={a.canDelete}
                deleteHint={a.isMine && !a.canDelete ? "לא ניתן למחוק תור של היום" : "מחיקה"}
                editIcon={<Icon name="pencil" size={16} />}
                deleteIcon={<Icon name="trash-2" size={16} />}
                onOpen={() => onOpen(a)}
                onEdit={() => onEdit(a)}
                onDelete={() => onDelete(a)}
                style={idx === filtered.length - 1 ? { borderBottom: "none" } : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
