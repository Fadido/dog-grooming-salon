"use client";

import type { ReactNode } from "react";
import { Badge, Button, Dialog, Icon } from "@/design-system";
import { Notice } from "@/features/common/Notice";
import type { AppointmentDetailsDto } from "@/lib/types";
import { arrivalLabel, currency, dogTypeLabel, formatCreatedAt, isToday } from "@/lib/format";

interface DetailModalProps {
  open: boolean;
  detail: AppointmentDetailsDto | null;
  onClose: () => void;
  onEdit: (detail: AppointmentDetailsDto) => void;
  onDelete: (detail: AppointmentDetailsDto) => void;
}

function DetailRow({ icon, label, value, strong }: { icon: string; label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border-soft)" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, flex: "0 0 auto", borderRadius: "var(--radius-sm)",
        background: "var(--surface-sunken)", color: "var(--text-muted)",
      }}>
        <Icon name={icon} size={17} />
      </span>
      <span style={{ flex: 1, fontSize: 14, color: "var(--text-muted)" }}>{label}</span>
      <span className="ltr-nums" style={{
        fontSize: strong ? 17 : 15,
        fontWeight: strong ? 800 : 600,
        fontFamily: strong ? "var(--font-display)" : "var(--font-body)",
        color: strong ? "var(--color-primary-press)" : "var(--text-strong)",
      }}>{value}</span>
    </div>
  );
}

export function DetailModal({ open, detail, onClose, onEdit, onDelete }: DetailModalProps) {
  if (!detail) return null;

  const mine = detail.isMine;
  const today = isToday(detail.scheduledTime);

  let footer: ReactNode;
  if (mine) {
    footer = (
      <>
        <Button variant="primary" icon={<Icon name="pencil" size={16} />} onClick={() => onEdit(detail)}>עריכה</Button>
        <Button variant="danger" icon={<Icon name="trash-2" size={16} />} disabled={today} onClick={() => onDelete(detail)}>מחיקה</Button>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" onClick={onClose}>סגירה</Button>
      </>
    );
  } else {
    footer = <Button variant="ghost" fullWidth onClick={onClose}>סגירה</Button>;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={460}
      icon={<Icon name="paw-print" size={22} />}
      title="פרטי התור"
      subtitle={detail.customerFirstName}
      footer={footer}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        {mine && <Badge tone="primary">התור שלי</Badge>}
        {detail.discountApplied && <Badge tone="success" icon={<Icon name="badge-percent" size={13} />}>10% הנחת נאמנות</Badge>}
      </div>

      <DetailRow icon="user" label="שם הלקוח" value={detail.customerFirstName} />
      <DetailRow icon="dog" label="סוג הכלב" value={dogTypeLabel(detail.dogType)} />
      <DetailRow icon="calendar" label="זמן הגעה מיועד" value={arrivalLabel(detail.scheduledTime)} />
      <DetailRow icon="banknote" label="מחיר" value={currency(detail.finalPrice)} strong />
      <DetailRow icon="history" label="נוצר בתאריך" value={formatCreatedAt(detail.createdAt)} />

      {mine && today && (
        <Notice tone="warning" style={{ marginTop: 14, fontSize: 13 }}>
          לא ניתן למחוק תור שמתוכנן להיום
        </Notice>
      )}
    </Dialog>
  );
}
