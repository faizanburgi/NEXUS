"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, CalendarClock, Radio, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { CpdRing } from "@/components/ui/CpdRing";
import { UrgencyFeed, sourceIcon } from "@/components/ui/UrgencyFeed";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/lib/useStore";

export default function AdvisorDashboard() {
  const store = useStore();
  const router = useRouter();

  const advisor = store.getAdvisor();
  const flags = store.getFlags();
  const activeFlags = store.getActiveFlags();
  const meetings = store.getMeetings();
  const audit = store.getAuditReadiness();

  const handleResolve = (flagId: string) => {
    store.resolveFlag(flagId, "Resolved from dashboard urgency feed.");
  };

  return (
    <>
      <PageHeader
        title={`Good morning, ${advisor.name.split(" ")[0]}`}
        subtitle="Your single intelligent view — everything connected, live."
      />

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active urgency flags"
          value={String(activeFlags.length)}
          hint="Streaming from all sections"
          icon={<Radio className="h-4 w-4" />}
        />
        <StatCard
          label="Meetings today"
          value={String(meetings.filter((m) => m.date === "Today").length)}
          hint="Urgent ones float to top"
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <StatCard
          label="CPD progress"
          value={`${advisor.cpdCompleted}/${advisor.cpdRequired}`}
          hint="Auto-synced from Library"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Audit readiness"
          value={`${audit.score}`}
          hint="MAS compliance score"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Urgency Feed"
            description="Live flags from chat, partners, portfolio & calendar."
            icon={<Radio className="h-4 w-4" />}
            action={
              <Badge tone={activeFlags.length ? "red" : "green"}>
                {activeFlags.length} active
              </Badge>
            }
          />
          <CardBody>
            <UrgencyFeed
              flags={flags}
              clientName={(cid) => store.clientName(cid)}
              onResolve={(flag) => handleResolve(flag.id)}
              onSelect={(flag) => router.push(`/advisor/clients/${flag.clientId}`)}
              showResolved
            />
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="CPD Compliance" description="Current cycle" />
            <CardBody className="flex flex-col items-center gap-3 py-6">
              <CpdRing value={advisor.cpdCompleted} max={advisor.cpdRequired} />
              <Link href="/advisor/profile" className="w-full">
                <Button fullWidth variant="secondary" size="sm">
                  View profile
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Today's Agenda" icon={<CalendarClock className="h-4 w-4" />} />
            <CardBody className="space-y-2">
              {meetings
                .filter((m) => m.date === "Today")
                .map((m) => {
                  const urgent = m.urgencyFlagId || store.hasActiveFlag(m.clientId);
                  const Icon = sourceIcon.calendar;
                  return (
                    <Link
                      key={m.id}
                      href={`/advisor/clients/${m.clientId}`}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all hover:shadow-sm ${
                        urgent
                          ? "border-red-400/40 bg-red-500/10 animate-pulse-slow"
                          : "border-border hover:border-foreground/20"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${urgent ? "text-red-300" : "text-muted"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {store.clientName(m.clientId)}
                        </p>
                        <p className="text-xs text-muted">
                          {m.time} · {m.type}
                        </p>
                      </div>
                      {urgent ? <Badge tone="red">Urgent</Badge> : null}
                    </Link>
                  );
                })}
              <Link href="/advisor/calendar" className="block">
                <Button fullWidth variant="ghost" size="sm">
                  Open calendar
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
