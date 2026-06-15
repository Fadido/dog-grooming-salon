"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, Icon } from "@/design-system";
import { Notice } from "@/features/common/Notice";
import { QueueScreen } from "@/features/queue/QueueScreen";
import { BookingModal, type EditingAppointment } from "@/features/appointments/BookingModal";
import { DetailModal } from "@/features/appointments/DetailModal";
import { useAuth } from "@/lib/auth";
import { ApiError, appointmentsApi, haircutTypesApi } from "@/lib/api";
import { LOYALTY_THRESHOLD } from "@/lib/loyalty";
import { arrivalLabel, combineDateTime, parseServerDate, toDateInput, toTimeInput } from "@/lib/format";
import type { AppointmentDetailsDto, AppointmentQueueDto, HaircutTypeDto } from "@/lib/types";

export default function QueuePage() {
  const router = useRouter();
  const { token, user, ready, logout } = useAuth();

  const [haircutTypes, setHaircutTypes] = useState<HaircutTypeDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentQueueDto[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [booking, setBooking] = useState<{ open: boolean; editing: EditingAppointment | null }>({ open: false, editing: null });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [detail, setDetail] = useState<{ open: boolean; data: AppointmentDetailsDto | null }>({ open: false, data: null });

  const [confirm, setConfirm] = useState<{ open: boolean; target: AppointmentQueueDto | AppointmentDetailsDto | null }>({ open: false, target: null });
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---- Auth guard ----
  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  const handleAuthError = useCallback((err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      logout();
      router.replace("/login");
      return true;
    }
    return false;
  }, [logout, router]);

  const reloadAppointments = useCallback(async () => {
    if (!token) return;
    try {
      const list = await appointmentsApi.list(token);
      setAppointments(list);
      setLoadError(null);
    } catch (err) {
      if (handleAuthError(err)) return;
      setLoadError(err instanceof ApiError ? err.message : "טעינת התורים נכשלה.");
    }
  }, [token, handleAuthError]);

  // ---- Initial data load ----
  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const [types, list] = await Promise.all([
          haircutTypesApi.list(token),
          appointmentsApi.list(token),
        ]);
        if (!active) return;
        setHaircutTypes(types);
        setAppointments(list);
      } catch (err) {
        if (!active) return;
        if (handleAuthError(err)) return;
        setLoadError(err instanceof ApiError ? err.message : "טעינת הנתונים נכשלה.");
      }
    })();
    return () => { active = false; };
  }, [token, handleAuthError]);

  const myCount = appointments.filter((a) => a.isMine).length;
  // 4th booking onward: a customer with >= 3 existing appointments gets the discount.
  const hasLoyalty = myCount >= LOYALTY_THRESHOLD;

  // ---- Booking ----
  function openAdd() {
    setBookingError(null);
    setBooking({ open: true, editing: null });
  }

  function editFromQueue(a: AppointmentQueueDto) {
    const haircutTypeId = haircutTypes.find((t) => t.name === a.dogType)?.id ?? haircutTypes[0]?.id ?? 0;
    const d = parseServerDate(a.scheduledTime);
    setBookingError(null);
    setBooking({ open: true, editing: { id: a.id, haircutTypeId, date: toDateInput(d), time: toTimeInput(d), discountApplied: a.discountApplied } });
  }

  function editFromDetail(dto: AppointmentDetailsDto) {
    const d = parseServerDate(dto.scheduledTime);
    setDetail({ open: false, data: null });
    setBookingError(null);
    setBooking({ open: true, editing: { id: dto.id, haircutTypeId: dto.haircutTypeId, date: toDateInput(d), time: toTimeInput(d), discountApplied: dto.discountApplied } });
  }

  async function saveBooking(input: { haircutTypeId: number; date: string; time: string }) {
    if (!token) return;
    setSaving(true);
    setBookingError(null);
    const payload = { haircutTypeId: input.haircutTypeId, scheduledTime: combineDateTime(input.date, input.time) };
    try {
      if (booking.editing) {
        await appointmentsApi.update(token, booking.editing.id, payload);
      } else {
        await appointmentsApi.create(token, payload);
      }
      setBooking({ open: false, editing: null });
      await reloadAppointments();
    } catch (err) {
      if (handleAuthError(err)) return;
      setBookingError(err instanceof ApiError ? err.message : "שמירת התור נכשלה.");
    } finally {
      setSaving(false);
    }
  }

  // ---- Detail ----
  async function openDetail(a: AppointmentQueueDto) {
    if (!token) return;
    try {
      const data = await appointmentsApi.get(token, a.id);
      setDetail({ open: true, data });
    } catch (err) {
      if (handleAuthError(err)) return;
      setLoadError(err instanceof ApiError ? err.message : "טעינת פרטי התור נכשלה.");
    }
  }

  // ---- Delete ----
  function askDelete(target: AppointmentQueueDto | AppointmentDetailsDto) {
    setConfirmError(null);
    setConfirm({ open: true, target });
  }

  async function doDelete() {
    if (!token || !confirm.target) return;
    setDeleting(true);
    setConfirmError(null);
    try {
      await appointmentsApi.remove(token, confirm.target.id);
      setConfirm({ open: false, target: null });
      setDetail({ open: false, data: null });
      await reloadAppointments();
    } catch (err) {
      if (handleAuthError(err)) return;
      setConfirmError(err instanceof ApiError ? err.message : "מחיקת התור נכשלה.");
    } finally {
      setDeleting(false);
    }
  }

  function onLogout() {
    logout();
    router.replace("/login");
  }

  if (!ready || !token) return null;

  return (
    <>
      <QueueScreen
        userName={user?.firstName ?? ""}
        appointments={appointments}
        onLogout={onLogout}
        onAdd={openAdd}
        onOpen={openDetail}
        onEdit={editFromQueue}
        onDelete={askDelete}
      />

      {loadError && (
        <div style={{ maxWidth: 880, margin: "-40px auto 0", padding: "0 22px" }}>
          <Notice tone="danger">{loadError}</Notice>
        </div>
      )}

      <BookingModal
        open={booking.open}
        haircutTypes={haircutTypes}
        editing={booking.editing}
        hasLoyalty={hasLoyalty}
        saving={saving}
        error={bookingError}
        onClose={() => setBooking({ open: false, editing: null })}
        onSave={saveBooking}
      />

      <DetailModal
        open={detail.open}
        detail={detail.data}
        onClose={() => setDetail({ open: false, data: null })}
        onEdit={editFromDetail}
        onDelete={askDelete}
      />

      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, target: null })}
        width={400}
        icon={<Icon name="trash-2" size={22} />}
        title="מחיקת תור"
        subtitle={confirm.target ? `${confirm.target.customerFirstName} · ${arrivalLabel(confirm.target.scheduledTime)}` : ""}
        footer={
          <>
            <Button variant="danger" icon={<Icon name="trash-2" size={16} />} disabled={deleting} onClick={doDelete}>
              {deleting ? "מוחקים…" : "כן, למחוק"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirm({ open: false, target: null })}>ביטול</Button>
          </>
        }
      >
        <p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.6 }}>
          האם למחוק את התור? פעולה זו אינה ניתנת לשחזור.
        </p>
        {confirmError && <Notice tone="danger" style={{ marginTop: 12 }}>{confirmError}</Notice>}
      </Dialog>
    </>
  );
}
