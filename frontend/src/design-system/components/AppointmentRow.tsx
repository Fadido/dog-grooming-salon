"use client";

import type { CSSProperties, ReactNode } from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";

export interface AppointmentRowProps {
  name: string;
  arrival: string;        // e.g. "היום · 14:30"
  dogType: string;        // e.g. "כלב בינוני"
  price?: string;         // string label
  mine?: boolean;
  discounted?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  deleteHint?: string | null;   // tooltip when delete is blocked (e.g. same-day)
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editIcon?: ReactNode;
  deleteIcon?: ReactNode;
  style?: CSSProperties;
}

/**
 * AppointmentRow — a single client waiting in the grooming queue.
 * Highlights the logged-in user's own rows; hides/disables actions on others'.
 */
export function AppointmentRow({
  name,
  arrival,
  dogType,
  price,
  mine = false,
  discounted = false,
  canEdit = false,
  canDelete = false,
  deleteHint = null,
  onOpen,
  onEdit,
  onDelete,
  editIcon = "✎",
  deleteIcon = "🗑",
  style,
}: AppointmentRowProps) {
  return (
    <div
      onClick={onOpen}
      className={`pk-row--clickable${mine ? " pk-row--mine" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: "16px",
        padding: "14px 18px",
        background: mine ? "var(--surface-mine)" : "var(--surface-card)",
        borderInlineStart: mine ? "3px solid var(--color-primary)" : "3px solid transparent",
        borderBottom: "1px solid var(--border-soft)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      {/* client */}
      <div style={{ display: "flex", alignItems: "center", gap: "13px", minWidth: 0 }}>
        <Avatar name={name} tone={mine ? "primary" : "auto"} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)" as unknown as number,
              fontSize: "var(--text-base)", color: "var(--text-strong)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{name}</span>
            {mine && <Badge tone="primary">התור שלי</Badge>}
            {discounted && <Badge tone="success">10% הנחה</Badge>}
          </div>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{dogType}</span>
        </div>
      </div>

      {/* arrival + price */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
        <span className="ltr-nums" style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--weight-medium)" as unknown as number,
          fontSize: "var(--text-base)", color: "var(--text-body)",
        }}>{arrival}</span>
        {price && <span className="ltr-nums" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{price}</span>}
      </div>

      {/* actions */}
      <div style={{ display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
        {canEdit ? (
          <IconButton label="עריכה" tone="primary" variant="soft" size="sm" onClick={onEdit}>{editIcon}</IconButton>
        ) : null}
        {canEdit ? (
          // The tooltip lives on the wrapper span: browsers don't show a
          // disabled button's own `title`, so when delete is blocked
          // (e.g. same-day) the hint would otherwise be invisible.
          <span
            title={deleteHint || "מחיקה"}
            style={{ display: "inline-flex", cursor: canDelete ? "default" : "not-allowed" }}
          >
            <IconButton
              label={deleteHint || "מחיקה"}
              tone="danger" variant="soft" size="sm"
              disabled={!canDelete} onClick={canDelete ? onDelete : undefined}
            >{deleteIcon}</IconButton>
          </span>
        ) : null}
      </div>
    </div>
  );
}
