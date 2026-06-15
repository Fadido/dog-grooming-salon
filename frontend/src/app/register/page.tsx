"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/features/auth/AuthShell";
import { Button, Field, Input, Icon } from "@/design-system";
import { Notice } from "@/features/common/Notice";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register, token, ready } = useAuth();
  const [firstName, setFirstName] = useState("");
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
      await register({ firstName, username, password });
      router.replace("/queue");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "אירעה שגיאה. נסו שוב.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="הצטרפו לפינוקי" subtitle="כמה פרטים ואפשר להתחיל לפנק">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="שם פרטי" htmlFor="rn">
          <Input id="rn" value={firstName} onChange={(e) => setFirstName(e.target.value)} icon={<Icon name="smile" />} placeholder="איך לקרוא לכם?" />
        </Field>
        <Field label="שם משתמש" htmlFor="ru">
          <Input id="ru" value={username} onChange={(e) => setUsername(e.target.value)} icon={<Icon name="user" />} placeholder="בחרו שם משתמש" autoComplete="username" />
        </Field>
        <Field label="סיסמה" htmlFor="rp" hint="לפחות 6 תווים">
          <Input id="rp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Icon name="lock" />} placeholder="בחרו סיסמה" autoComplete="new-password" />
        </Field>

        {error && <Notice tone="danger">{error}</Notice>}

        <Button type="submit" size="lg" fullWidth icon={<Icon name="paw-print" />} disabled={submitting} style={{ marginTop: 4 }}>
          {submitting ? "נרשמים…" : "הרשמה"}
        </Button>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--text-muted)" }}>
        <a href="/login" className="pk-link" style={{ color: "var(--text-link)", fontWeight: 700 }}
           onClick={(e) => { e.preventDefault(); router.push("/login"); }}>
          חזרה למסך הכניסה
        </a>
      </p>
    </AuthShell>
  );
}
