import type { CSSProperties, HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string | null;
  size?: number;
  tone?: "primary" | "auto";
}

/**
 * Avatar — circular initial badge for a client, with a warm tint derived
 * from the name. Optionally renders an image.
 */
export function Avatar({ name = "", src = null, size = 44, tone, style, ...rest }: AvatarProps) {
  const palettes = [
    { bg: "var(--coral-100)", fg: "var(--coral-700)" },
    { bg: "var(--teal-100)", fg: "var(--teal-700)" },
    { bg: "var(--amber-100)", fg: "var(--amber-700)" },
    { bg: "var(--blue-100)", fg: "var(--blue-700)" },
    { bg: "var(--green-100)", fg: "var(--green-700)" },
  ];
  const initial = (name || "?").trim().charAt(0) || "?";
  let idx = 0;
  for (let i = 0; i < name.length; i++) idx = (idx + name.charCodeAt(i)) % palettes.length;
  const p = tone === "primary" ? { bg: "var(--color-primary)", fg: "var(--white)" } : palettes[idx];

  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    flex: "0 0 auto",
    borderRadius: "50%",
    background: src ? "var(--surface-sunken)" : p.bg,
    color: p.fg,
    fontFamily: "var(--font-display)",
    fontWeight: "var(--weight-bold)" as unknown as number,
    fontSize: size * 0.42,
    lineHeight: 1,
    overflow: "hidden",
    userSelect: "none",
    ...style,
  };

  return (
    <span style={css} {...rest}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initial}
    </span>
  );
}
