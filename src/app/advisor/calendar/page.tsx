"use client";

import { useRouter } from "next/navigation";
import { BellRing, CalendarClock, Check, Clock, FileText, Flame } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";
import type { MeetingType } from "@/types";

const typeTone: Record<MeetingType, "red" | "blue" | "neutral" | "green"> = {
  urgent: "red",
  onboarding: "blue",
  review: "neutral",
  planning: "green",
};

export default function AdvisorCalendarPage() {
  const store = useStore();
  const router = useRouter();
  const meetings = store.getMeetings();
  const reminders = store.getReminders();
  const activeReminders = reminders.filter((r) => !r.done);

  return (
    <>
      <PageHeader
        title="Meeting Calendar"
        subtitle="Urgency-flagged clients are highlighted and pulled to the top."
      />

      {reminders.length > 0 ? (
        <Card className="mb-5 border-accent/30">
          <CardHeader
            title="Reminders"
            description="Auto-set when a client books a meeting."
            icon={<BellRing className="h-4 w-4" />}
            action={<Badge tone="blue">{activeReminders.length} active</Badge>}
          />
          <CardBody className="space-y-2">
            {reminders.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                  r.done ? "border-border opacity-60" : "border-accent/30 bg-accent/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BellRing className={`h-4 w-4 ${r.done ? "text-muted" : "text-accent"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.message}</p>
                    <p className="text-xs text-muted">Reminder · {r.leadTime}</p>
                  </div>
                </div>
                {r.done ? (
                  <Badge tone="green">Done</Badge>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => store.resolveReminder(r.id)}>
                    <Check className="h-3.5 w-3.5" />
                    Dismiss
                  </Button>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      ) : null}

      <div className="space-y-3">
        {meetings.map((m, index) => {
          const urgent = Boolean(m.urgencyFlagId) || store.hasActiveFlag(m.clientId);
          return (
            <Card
              key={m.id}
              className={`animate-fade-up ${urgent ? "border-red-400/40 bg-red-500/[0.07] animate-pulse-slow" : ""}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
                      urgent ? "bg-red-500/20 text-red-300" : "bg-foreground/5 text-foreground"
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase">{m.date}</span>
                    <span className="text-base font-semibold leading-none">{m.time}</span>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
                      {store.clientName(m.clientId)}
                      {urgent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-300">
                          <Flame className="h-3.5 w-3.5" /> Urgent
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {m.durationMinutes} min
                      </span>
                      <Badge tone={typeTone[m.type]}>{m.type}</Badge>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {urgent ? (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/advisor/clients/${m.clientId}`)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View prep notes
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/advisor/clients/${m.clientId}`)}
                    >
                      Details
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="mt-5">
        <CardBody className="flex items-center gap-3 text-sm text-muted">
          <CalendarClock className="h-4 w-4" />
          Meetings auto-reprioritize when an urgency flag is raised for a client — try
          triggering one from the Chat Box.
        </CardBody>
      </Card>
    </>
  );
}
