"use client";

import {
  CalendarDays,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import type { NavItem } from "@/components/ui/Sidebar";

const NAV: NavItem[] = [
  { label: "Engagement", href: "/client", icon: Workflow },
  { label: "Services", href: "/client/services", icon: LayoutGrid },
  { label: "Chat Box", href: "/client/chat", icon: MessageSquare },
  { label: "Meetings", href: "/client/meetings", icon: CalendarDays },
  { label: "Partners", href: "/client/partners", icon: Sparkles },
  { label: "Progress", href: "/client/progress", icon: Target },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalName="Client Portal" requiredRole="CLIENT" items={NAV}>
      {children}
    </PortalLayout>
  );
}
