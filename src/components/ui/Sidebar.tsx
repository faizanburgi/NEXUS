"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import type { User } from "@/types";
import { Logo } from "@/components/ui/Logo";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  portalName: string;
  items: NavItem[];
  user: User;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function Sidebar({
  portalName,
  items,
  user,
  onLogout,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="px-4 py-5">
        <Logo iconSize={36} textClassName="text-white text-lg" priority />
        <p className="mt-2 pl-[46px] text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          {portalName}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/advisor" &&
              item.href !== "/client" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-transform duration-150 group-hover:scale-110 ${
                  active ? "text-gray-900" : "text-gray-400 group-hover:text-[var(--accent)]"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {user.avatarInitials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-red-500/15 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );
}
