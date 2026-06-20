"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AuthService } from "@/services";
import type { User } from "@/types";

/**
 * Subscribes to the AuthService store and derives the verified current user.
 * Using `useSyncExternalStore` keeps auth state in sync with browser storage
 * (and across tabs) without calling setState inside an effect.
 *
 * Returns `undefined` while the client snapshot has not resolved yet (SSR /
 * first paint), and `User | null` thereafter.
 */
export function useAuth(): { user: User | null; resolved: boolean } {
  const token = useSyncExternalStore(
    AuthService.subscribe,
    AuthService.getTokenSnapshot,
    AuthService.getServerSnapshot
  );

  const user = useMemo(() => AuthService.userFromToken(token), [token]);

  // On the server the snapshot is intentionally null; once hydrated the client
  // snapshot is authoritative.
  const resolved = typeof window !== "undefined";

  return { user, resolved };
}
