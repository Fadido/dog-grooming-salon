"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from "./types";

const STORAGE_KEY = "pk_auth";

interface AuthState {
  token: string;
  expiresAt: string;
  user: UserDto;
}

interface AuthContextValue {
  user: UserDto | null;
  token: string | null;
  ready: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthState;
    // Drop expired sessions.
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStored());
    setReady(true);
  }, []);

  function persist(auth: AuthResponse) {
    const next: AuthState = { token: auth.token, expiresAt: auth.expiresAt, user: auth.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }

  async function login(body: LoginRequest) {
    persist(await authApi.login(body));
  }

  async function register(body: RegisterRequest) {
    persist(await authApi.register(body));
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setState(null);
  }

  const value: AuthContextValue = {
    user: state?.user ?? null,
    token: state?.token ?? null,
    ready,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
