import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Circle,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { ActivityItem, ActivityType } from "@/types";
import { Badge } from "./Badge";

const typeIcon: Record<ActivityType, LucideIcon> = {
  task: CheckCircle2,
  alert: AlertTriangle,
  meeting: CalendarClock,
  message: MessageSquare,
};

function statusMeta(status: ActivityItem["status"]) {
  switch (status) {
    case "done":
      return { tone: "green" as const, label: "Done", Dot: CheckCircle2 };
    case "pending":
      return { tone: "amber" as const, label: "Pending", Dot: Circle };
    default:
      return { tone: "blue" as const, label: "Upcoming", Dot: Circle };
  }
}

export function Timeline({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative ml-3">
      {items.map((item, index) => {
        const Icon = typeIcon[item.type];
        const { tone, label, Dot } = statusMeta(item.status);
        const isLast = index === items.length - 1;
        return (
          <li
            key={item.id}
            className="relative pl-8 pb-6 last:pb-0 animate-fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {!isLast ? (
              <span className="absolute left-[7px] top-5 h-full w-px bg-border" />
            ) : null}
            <span
              className={`absolute left-0 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                item.status === "done"
                  ? "text-emerald-600"
                  : item.status === "pending"
                  ? "text-amber-500"
                  : "text-blue-500"
              }`}
            >
              <Dot className="h-3.5 w-3.5 fill-current" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted">{item.time}</span>
              <span className="flex items-center gap-1.5 text-[15px] font-medium tracking-tight text-foreground">
                <Icon className="h-4 w-4 text-muted" />
                {item.title}
              </span>
              <Badge tone={tone}>{label}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
