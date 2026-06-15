import {
  PawPrint, Dog, Calendar, Clock, Pencil, Trash2, Plus, Search, User, Lock,
  LogIn, LogOut, Banknote, History, Info, Smile, Check, PartyPopper,
  BadgePercent, CalendarHeart, SearchX, X, ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Icon — thin wrapper that maps the design system's kebab-case icon names
 * (e.g. "paw-print") to Lucide icons, preserving the `<Icon name size />` API
 * used throughout the original design prototypes.
 */
const ICONS: Record<string, LucideIcon> = {
  "paw-print": PawPrint,
  dog: Dog,
  calendar: Calendar,
  clock: Clock,
  pencil: Pencil,
  "trash-2": Trash2,
  plus: Plus,
  search: Search,
  user: User,
  lock: Lock,
  "log-in": LogIn,
  "log-out": LogOut,
  banknote: Banknote,
  history: History,
  info: Info,
  smile: Smile,
  check: Check,
  "party-popper": PartyPopper,
  "badge-percent": BadgePercent,
  "calendar-heart": CalendarHeart,
  "search-x": SearchX,
  x: X,
  "chevron-down": ChevronDown,
};

export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, strokeWidth = 2, style }: IconProps) {
  const Glyph = ICONS[name] ?? PawPrint;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        ...style,
      }}
    >
      <Glyph size={size} strokeWidth={strokeWidth} />
    </span>
  );
}
