"use client";

import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Network,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import type { NavItem } from "@/components/ui/Sidebar";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/advisor", icon: LayoutDashboard },
  { label: "My Profile", href: "/advisor/profile", icon: UserCircle },
  { label: "Clients", href: "/advisor/clients", icon: Users },
  { label: "Calendar", href: "/advisor/calendar", icon: CalendarDays },
  { label: "Partners", href: "/advisor/partners", icon: Network },
  { label: "Chat Box", href: "/advisor/chat", icon: MessageSquare },
  { label: "Compliance", href: "/advisor/compliance", icon: ShieldCheck },
];

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalName="Advisor Portal" requiredRole="ADVISOR" items={NAV}>
      {children}
    </PortalLayout>
  );
}
