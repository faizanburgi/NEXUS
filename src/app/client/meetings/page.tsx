"use client";

import { useState } from "react";
import { BellRing, CalendarPlus, Clock, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";
import { DEMO_CLIENT_ID } from "@/services/NexusStore";
import type { MeetingType } from "@/types";

const TYPES: MeetingType[] = ["review", "planning", "onboarding"];
const DATES = ["Today", "Tomorrow", "Mon", "Tue", "Wed", "Thu", "Fri"];

const typeTone: Record<MeetingType, "red" | "blue" | "neutral" | "green"> = {
  urgent: "red",
  onboarding: "blue",
  review: "neutral",
  planning: "green",
};

export default function ClientMeetingsPage() {
  const store = useStore();
  const advisor = store.getAdvisor();
  const meetings = store.getClientMeetings(DEMO_CLIENT_ID);

  const [type, setType] = useState<MeetingType>("review");
  const [date, setDate] = useState("Tomorrow");
  const [time, setTime] = useState("14:00");
  const [confirmed, setConfirmed] = useState(false);

  const book = () => {
    store.bookMeeting(DEMO_CLIENT_ID, date, time, type, 30);
    setConfirmed(true);
    window.setTimeout(() => setConfirmed(false), 2600);
  };

  return (
    <>
      <PageHeader
        title="Meetings"
        subtitle="Book a session — your advisor gets a reminder automatically."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* booking form */}
        <Card className="h-fit">
          <CardHeader
            title="Book a Meeting"
            description={`With ${advisor.name}`}
            icon={<CalendarPlus className="h-4 w-4" />}
          />
          <CardBody className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      type === t
                        ? "bg-foreground text-primary-foreground"
                        : "bg-foreground/5 text-muted hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Day</label>
              <div className="flex flex-wrap gap-1.5">
                {DATES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      date === d
                        ? "bg-accent text-white"
                        : "bg-foreground/5 text-muted hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <Button fullWidth onClick={book}>
              <CalendarPlus className="h-4 w-4" />
              Confirm booking
            </Button>

            {confirmed ? (
              <p className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/30 animate-fade-up">
                <BellRing className="h-3.5 w-3.5" />
                Booked — a reminder was set for {advisor.name}.
              </p>
            ) : null}
          </CardBody>
        </Card>

        {/* my meetings */}
        <div className="space-y-3 lg:col-span-2">
          {meetings.length === 0 ? (
            <Card>
              <CardBody className="py-10 text-center text-sm text-muted">
                No meetings yet — book your first session.
              </CardBody>
            </Card>
          ) : (
            meetings.map((m, index) => (
              <Card key={m.id} interactive className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                      <span className="text-[11px] font-medium uppercase text-muted">{m.date}</span>
                      <span className="text-base font-semibold leading-none">{m.time}</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold capitalize tracking-tight text-foreground">
                        {m.type} meeting
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {m.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5" />
                          {advisor.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge tone={typeTone[m.type]}>{m.status}</Badge>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
