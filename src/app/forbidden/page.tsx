"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/useAuth";
import type { Role } from "@/types";

const HOME: Record<Role, { href: string; label: string }> = {
  ADVISOR: { href: "/advisor", label: "Back to Advisor dashboard" },
  CLIENT: { href: "/client", label: "Back to Client dashboard" },
};

export default function ForbiddenPage() {
  const { user } = useAuth();
  const home = user
    ? HOME[user.role]
    : { href: "/", label: "Back to login" };

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-400/30">
          <ShieldX className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
          403 · Forbidden
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Access denied
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          You don&apos;t have permission to view this portal. This area is
          restricted by role-based access control.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={home.href}>
            <Button>{home.label}</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Switch account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
