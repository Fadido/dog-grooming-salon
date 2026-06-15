"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, Field, Input, ServiceOption, Icon } from "@/design-system";
import { Notice } from "@/features/common/Notice";
import type { HaircutTypeDto } from "@/lib/types";
import { currency, dogTypeLabel, durationLabel, todayIsoDate } from "@/lib/format";
import { LOYALTY_MULTIPLIER } from "@/lib/loyalty";

export interface EditingAppointment {
  id: number;
  haircutTypeId: number;
  date: string;
  time: string;
  discountApplied: boolean;
}

interface BookingModalProps {
  open: boolean;
  haircutTypes: HaircutTypeDto[];
  editing: EditingAppointment | null;
  hasLoyalty: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (input: { haircutTypeId: number; date: string; time: string }) => void;
}

function discounted(price: number) {
  return Math.round(price * LOYALTY_MULTIPLIER);
}

export function BookingModal({ open, haircutTypes, editing, hasLoyalty, saving, error, onClose, onSave }: BookingModalProps) {
  const defaultTypeId =
    haircutTypes.find((t) => /medium/i.test(t.name))?.id ?? haircutTypes[0]?.id ?? 0;

  const [haircutTypeId, setHaircutTypeId] = useState(defaultTypeId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  useEffect(() => {
    if (!open) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

    setHaircutTypeId(editing ? editing.haircutTypeId : defaultTypeId);
    setDate(editing ? editing.date : tomorrowIso);
    setTime(editing ? editing.time : "10:00");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  // Discount applies to a new booking when the user is a loyalty client, or
  // it was already earned on the appointment being edited.
  const applyDiscount = editing ? editing.discountApplied : hasLoyalty;
  const selected = haircutTypes.find((t) => t.id === haircutTypeId);
  const basePrice = selected?.price ?? 0;
  const finalPrice = applyDiscount ? discounted(basePrice) : basePrice;

  const footer = (
    <>
      <Button variant="primary" size="lg" icon={<Icon name="check" />} disabled={saving || !selected}
        onClick={() => onSave({ haircutTypeId, date, time })}>
        {saving ? "שומרים…" : editing ? "שמירת שינויים" : "הוספת תור"}
      </Button>
      <Button variant="ghost" size="lg" onClick={onClose}>ביטול</Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={500}
      icon={<Icon name="paw-print" size={22} />}
      title={editing ? "עריכת תור" : "תור חדש"}
      subtitle={editing ? "עדכנו את פרטי התספורת" : "בחרו סוג תספורת ומועד הגעה"}
      footer={footer}
    >
      {applyDiscount && (
        <Notice tone="success" icon="party-popper" style={{ marginBottom: 16 }}>
          מגיע לכם! הנחת נאמנות של 10% חלה על תור זה
        </Notice>
      )}

      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 9 }}>סוג תספורת</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
        {haircutTypes.map((t) => (
          <ServiceOption
            key={t.id}
            title={dogTypeLabel(t.name)}
            duration={durationLabel(t.durationMinutes)}
            price={currency(t.price)}
            discountPrice={applyDiscount ? currency(discounted(t.price)) : null}
            icon={<Icon name="paw-print" size={18} />}
            selected={haircutTypeId === t.id}
            onSelect={() => setHaircutTypeId(t.id)}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <Field label="תאריך הגעה" htmlFor="bd" style={{ flex: 1 }}>
          <Input id="bd" type="date" value={date} min={todayIsoDate()} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="שעת הגעה" htmlFor="bt" style={{ flex: 1 }}>
          <Input id="bt" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>

      {error && <Notice tone="danger" style={{ marginBottom: 14 }}>{error}</Notice>}

      {/* Live summary */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--color-primary-tint)", border: "1px solid var(--coral-200)",
          borderRadius: "var(--radius-md)", padding: "13px 16px", marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="clock" size={18} />
          <span style={{ fontSize: 14, color: "var(--text-body)" }}>
            משך משוער · {selected ? durationLabel(selected.durationMinutes) : "—"}
          </span>
        </div>
        <div className="ltr-nums" style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {applyDiscount && (
            <span style={{ fontSize: 14, color: "var(--text-subtle)", textDecoration: "line-through" }}>
              {currency(basePrice)}
            </span>
          )}
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--color-primary-press)" }}>
            {currency(finalPrice)}
          </span>
        </div>
      </div>
    </Dialog>
  );
}
