"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { token, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(token ? "/queue" : "/login");
  }, [ready, token, router]);

  return null;
}
