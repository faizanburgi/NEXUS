import { issueToken, verifyToken } from "@/lib/jwt";
import type { Role, User } from "@/types";

export const AUTH_COOKIE = "nexus_token";
const STORAGE_KEY = "nexus_token";

interface SeedUser extends User {
  password: string;
}

/**
 * Mock user directory. In a real system this would live behind an identity
 * provider; here it is an in-memory record used by the AuthService.
 */
const USERS: Record<Role, SeedUser> = {
  ADVISOR: {
    id: "adv-001",
    name: "Admin Advisor",
    email: "admin@nexus.io",
    role: "ADVISOR",
    avatarInitials: "AA",
    password: "advisor",
  },
  CLIENT: {
    id: "cli-alex",
    name: "Alex Carter",
    email: "alex@client.io",
    role: "CLIENT",
    avatarInitials: "AC",
    password: "client",
  },
};

/**
 * AuthService encapsulates all authentication concerns: issuing the mock JWT,
 * persisting it to a cookie (so the server-side proxy can read it) and to
 * localStorage, and resolving the current user. It is a singleton so callers
 * never instantiate auth state directly inside components.
 */
class AuthServiceImpl {
  private listeners = new Set<() => void>();

  private notify(): void {
    this.listeners.forEach((cb) => cb());
  }

  /** Subscribe to auth changes — backs `useSyncExternalStore`. */
  subscribe = (callback: () => void): (() => void) => {
    this.listeners.add(callback);
    if (typeof window !== "undefined") {
      window.addEventListener("storage", callback);
    }
    return () => {
      this.listeners.delete(callback);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", callback);
      }
    };
  };

  /** Stable primitive snapshot for `useSyncExternalStore`. */
  getTokenSnapshot = (): string | null => this.getToken();

  getServerSnapshot = (): string | null => null;

  private persistToken(token: string): void {
    if (typeof document === "undefined") return;
    const maxAge = 60 * 60 * 8;
    document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${maxAge}; samesite=lax`;
    window.localStorage.setItem(STORAGE_KEY, token);
    this.notify();
  }

  private clearToken(): void {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    window.localStorage.removeItem(STORAGE_KEY);
    this.notify();
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  }

  /** Demo bypass used by the hardcoded login buttons. */
  loginAs(role: Role): User {
    const seed = USERS[role];
    const token = issueToken({
      sub: seed.id,
      name: seed.name,
      email: seed.email,
      role: seed.role,
    });
    this.persistToken(token);
    return this.toPublicUser(seed);
  }

  /** Credentialed login against the mock directory. */
  login(email: string, password: string): User {
    const seed = Object.values(USERS).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!seed || seed.password !== password) {
      throw new Error("Invalid email or password.");
    }
    return this.loginAs(seed.role);
  }

  logout(): void {
    this.clearToken();
  }

  getCurrentUser(): User | null {
    return this.userFromToken(this.getToken());
  }

  /** Resolve a verified User from a raw token string (used by the auth hook). */
  userFromToken(token: string | null): User | null {
    const payload = verifyToken(token);
    if (!payload) return null;
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      avatarInitials: this.initials(payload.name),
    };
  }

  private initials(name: string): string {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  private toPublicUser(seed: SeedUser): User {
    const { password: _password, ...user } = seed;
    void _password;
    return user;
  }
}

export const AuthService = new AuthServiceImpl();
