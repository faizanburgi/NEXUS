"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AuthService } from "@/services";
import type { Role } from "@/types";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const HOME: Record<Role, string> = {
  ADVISOR: "/advisor",
  CLIENT: "/client",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const destinationFor = (role: Role) => {
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith(HOME[role])) return redirect;
    return HOME[role];
  };

  const goTo = (role: Role) => {
    // Full navigation so the proxy re-reads the freshly set auth cookie.
    window.location.assign(destinationFor(role));
  };

  const handleBypass = (role: Role) => {
    setPending(true);
    AuthService.loginAs(role);
    goTo(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = AuthService.login(email, password);
      setPending(true);
      goTo(user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-8 flex flex-col items-center animate-fade-up">
        <Logo
          priority
          iconSize={56}
          showTagline
          textClassName="text-white text-3xl"
          taglineClassName="text-white/70"
          className="drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        />
        <p className="mt-3 text-sm text-white/70">Sign in to your secure portal</p>
      </div>

      <div className="animate-card-in rounded-2xl border border-white/15 bg-surface/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-7" style={{ animationDelay: "80ms" }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-400/30">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={pending}>
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            Demo access
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={pending}
            onClick={() => handleBypass("ADVISOR")}
          >
            <Briefcase className="h-4 w-4" />
            Login as Advisor Admin
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={pending}
            onClick={() => handleBypass("CLIENT")}
          >
            <UserRound className="h-4 w-4" />
            Login as Client Alex
          </Button>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/70 animate-fade-up" style={{ animationDelay: "260ms" }}>
        <ShieldCheck className="h-3.5 w-3.5" />
        Zero-trust RBAC · Mock JWT session
      </p>
    </div>
  );
}
