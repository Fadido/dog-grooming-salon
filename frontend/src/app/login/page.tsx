"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/features/auth/AuthShell";
import { Button, Field, Input, Icon } from "@/design-system";
import { Notice } from "@/features/common/Notice";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, token, ready } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && token) router.replace("/queue");
  }, [ready, token, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ username, password });
      router.replace("/queue");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "אירעה שגיאה. נסו שוב.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="ברוכים הבאים 🐾" subtitle="התחברו כדי לנהל את התורים שלכם">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="שם משתמש" htmlFor="lu">
          <Input id="lu" value={username} onChange={(e) => setUsername(e.target.value)} icon={<Icon name="user" />} placeholder="שם משתמש" autoComplete="username" />
        </Field>
        <Field label="סיסמה" htmlFor="lp">
          <Input id="lp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Icon name="lock" />} placeholder="סיסמה" autoComplete="current-password" />
        </Field>

        {error && <Notice tone="danger">{error}</Notice>}

        <Button type="submit" size="lg" fullWidth icon={<Icon name="log-in" />} disabled={submitting} style={{ marginTop: 4 }}>
          {submitting ? "מתחברים…" : "כניסה"}
        </Button>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--text-muted)" }}>
        אין לכם חשבון?{" "}
        <a href="/register" className="pk-link" style={{ color: "var(--text-link)", fontWeight: 700 }}
           onClick={(e) => { e.preventDefault(); router.push("/register"); }}>
          להרשמה
        </a>
      </p>
    </AuthShell>
  );
}
