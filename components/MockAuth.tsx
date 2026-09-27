"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type MockUser = { name: string; handle: string; initials: string };
type MockAuth = { user: MockUser | null; signIn: () => void; signOut: () => void };

const STORAGE_KEY = "polaslot:mock-user";
const DEMO_USER: MockUser = { name: "Hawkeye Fan", handle: "@hawkfan", initials: "HF" };

const Ctx = createContext<MockAuth>({ user: null, signIn: () => {}, signOut: () => {} });

/**
 * Lightweight stand-in for Clerk so every feature works before keys are configured.
 * Once NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set, AuthControls switches to real Clerk components.
 */
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = useCallback(() => {
    setUser(DEMO_USER);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    } catch {}
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useMockAuth = () => useContext(Ctx);
