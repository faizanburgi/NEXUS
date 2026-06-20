"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Hand,
  MessageSquare,
  Network,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import type { FlagSource, Severity, UrgencyFlag } from "@/types";
import { Button } from "./Button";

export const sourceIcon: Record<FlagSource, LucideIcon> = {
  chat: MessageSquare,
  partner: Network,
  calendar: CalendarClock,
  portfolio: TrendingDown,
  manual: Hand,
};

const severityStyles: Record<Severity, { dot: string; ring: string; label: string }> = {
  high: { dot: "bg-red-500", ring: "ring-red-400/40 bg-red-500/15 text-red-300", label: "High" },
  med: { dot: "bg-amber-500", ring: "ring-amber-400/40 bg-amber-500/15 text-amber-300", label: "Medium" },
  low: { dot: "bg-blue-500", ring: "ring-blue-400/40 bg-blue-500/15 text-blue-300", label: "Low" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = severityStyles[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface UrgencyFeedProps {
  flags: UrgencyFlag[];
  clientName: (id: string) => string;
  onResolve?: (flag: UrgencyFlag) => void;
  onSelect?: (flag: UrgencyFlag) => void;
  showResolved?: boolean;
}

export function UrgencyFeed({
  flags,
  clientName,
  onResolve,
  onSelect,
  showResolved = false,
}: UrgencyFeedProps) {
  const visible = showResolved ? flags : flags.filter((f) => !f.resolved);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        <p className="text-sm text-muted">No active urgency flags. All clear.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {visible.map((flag) => {
        const Icon = sourceIcon[flag.source];
        const high = flag.severity === "high";
        return (
          <li
            key={flag.id}
            onClick={() => onSelect?.(flag)}
            className={`group flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 animate-fade-up ${
              flag.resolved
                ? "border-border bg-foreground/[0.02] opacity-70"
                : high
                ? "border-red-400/40 bg-red-500/10 shadow-sm hover:shadow-md"
                : "border-border hover:border-foreground/20 hover:shadow-sm"
            } ${onSelect ? "cursor-pointer" : ""}`}
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                flag.resolved ? "bg-foreground/5 text-muted" : high ? "bg-red-500/20 text-red-300" : "bg-foreground/5 text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {clientName(flag.clientId)}
                </span>
                {flag.resolved ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                    <CheckCircle2 className="h-3 w-3" /> Resolved
                  </span>
                ) : (
                  <SeverityBadge severity={flag.severity} />
                )}
                <span className="ml-auto font-mono text-[11px] text-muted">
                  {timeAgo(flag.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                <span className="font-medium capitalize text-foreground/70">{flag.source}</span>
                {" · "}
                {flag.reason}
              </p>
              {flag.triggerSnippet ? (
                <p className="mt-1.5 rounded-lg border-l-2 border-red-400/50 bg-white/5 px-2.5 py-1 text-xs italic text-foreground/75">
                  “{flag.triggerSnippet}”
                </p>
              ) : null}
              {!flag.resolved && onResolve ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(flag);
                  }}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Resolve flag
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
