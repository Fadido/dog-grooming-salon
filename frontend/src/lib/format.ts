// Display helpers — Hebrew-first formatting for dates, times, currency and
// haircut-type labels. Numbers are rendered inside .ltr-nums spans by the UI.

const pad = (n: number) => String(n).padStart(2, "0");

/** Parse a backend ISO datetime as local time. */
export function parseServerDate(iso: string): Date {
  return new Date(iso);
}

/** yyyy-MM-dd for <input type="date">. */
export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** HH:MM for <input type="time">. */
export function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Today's local date as yyyy-MM-dd (for date input min / "today" checks). */
export function todayIsoDate(): string {
  return toDateInput(new Date());
}

/** Combine a date input + time input into the datetime string the API expects. */
export function combineDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/** Warm Hebrew arrival label: "היום · 14:30" / "מחר · 14:30" / "17.6 · 14:30". */
export function arrivalLabel(iso: string): string {
  const d = parseServerDate(iso);
  const day0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date();
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((day0.getTime() - today0.getTime()) / 86_400_000);

  let day: string;
  if (diff === 0) day = "היום";
  else if (diff === 1) day = "מחר";
  else day = `${d.getDate()}.${d.getMonth() + 1}`;

  return `${day} · ${toTimeInput(d)}`;
}

/** Creation timestamp for the detail popup: "12.6.2026 · 09:14". */
export function formatCreatedAt(iso: string): string {
  const d = parseServerDate(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} · ${toTimeInput(d)}`;
}

/** Is this scheduled datetime on today's (local) date? */
export function isToday(iso: string): boolean {
  return toDateInput(parseServerDate(iso)) === todayIsoDate();
}

/** Shekel price label. */
export function currency(amount: number): string {
  return `${amount} ₪`;
}

/** Localize backend haircut-type names to the brand's Hebrew copy. */
const DOG_TYPE_LABELS: Record<string, string> = {
  "Small dog": "כלב קטן",
  "Medium dog": "כלב בינוני",
  "Large dog": "כלב גדול",
};

export function dogTypeLabel(name: string): string {
  return DOG_TYPE_LABELS[name] ?? name;
}

/** Duration label, e.g. "30 דקות". */
export function durationLabel(minutes: number): string {
  return `${minutes} דקות`;
}
