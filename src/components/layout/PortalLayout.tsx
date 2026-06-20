"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AuthService } from "@/services";
import { useAuth } from "@/lib/useAuth";
import type { Role } from "@/types";
import { Sidebar, type NavItem } from "@/components/ui/Sidebar";
import { Logo } from "@/components/ui/Logo";

interface PortalLayoutProps {
  portalName: string;
  requiredRole: Role;
  items: NavItem[];
  children: React.ReactNode;
}

export function PortalLayout({
  portalName,
  requiredRole,
  items,
  children,
}: PortalLayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Client-side guard: defence-in-depth alongside the server-side proxy.
  // We read auth directly from storage at mount time rather than from the
  // `useAuth` snapshot, because `useSyncExternalStore` returns the null server
  // snapshot during the hydration commit — using it here would incorrectly
  // redirect an already-authenticated user back to login. The effect only
  // navigates (no setState), keeping it side-effect clean.
  useEffect(() => {
    const current = AuthService.getCurrentUser();
    if (!current) {
      router.replace("/");
    } else if (current.role !== requiredRole) {
      router.replace("/forbidden");
    }
  }, [requiredRole, router]);

  const handleLogout = () => {
    AuthService.logout();
    router.replace("/");
  };

  if (!user || user.role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar
            portalName={portalName}
            items={items}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border shadow-xl animate-fade-up">
            <Sidebar
              portalName={portalName}
              items={items}
              user={user}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-foreground/5"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo iconSize={28} textClassName="text-foreground text-sm" />
          <span className="text-sm font-medium text-muted">· {portalName}</span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
