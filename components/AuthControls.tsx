"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { clerkEnabled } from "@/lib/auth";
import { useMockAuth } from "./MockAuth";

export default function AuthControls() {
  return clerkEnabled ? <ClerkControls /> : <MockControls />;
}

function ClerkControls() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn-secondary !py-2">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
      </SignedIn>
    </>
  );
}

function MockControls() {
  const { user, signIn, signOut } = useMockAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user)
    return (
      <button onClick={signIn} className="btn-secondary !py-2" title="Demo session — configure Clerk keys for real auth">
        Sign in
      </button>
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 text-xs font-semibold text-ink ring-2 ring-white"
        aria-label="Account menu"
      >
        {user.initials}
      </button>
      {open && (
        <div className="glass absolute right-0 top-11 z-50 w-56 rounded-2xl p-2 animate-fade-up">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-zinc-500">{user.handle} · demo session</p>
          </div>
          <button
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
