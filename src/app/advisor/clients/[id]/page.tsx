"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarClock,
  GraduationCap,
  MessageSquare,
  Network,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SeverityBadge, sourceIcon } from "@/components/ui/UrgencyFeed";
import { useStore } from "@/lib/useStore";

export default function ClientProfilePage() {
  const store = useStore();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const client = store.getClient(params.id);

  if (!client) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Client not found.</p>
        <Link href="/advisor/clients">
          <Button variant="secondary" className="mt-4">
            Back to clients
          </Button>
        </Link>
      </div>
    );
  }

  const flags = store.getClientFlags(client.id);
  const activeFlags = flags.filter((f) => !f.resolved);
  const messages = store.getMessages(client.id).slice(-3).reverse();
  const meeting = store.getMeetings().find((m) => m.clientId === client.id);
  const partners = client.partnerIds
    .map((pid) => store.getPartner(pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const gaps = store.getRecommendedCoursesForClient(client.id);
  const up = client.portfolioChangePct >= 0;

  return (
    <>
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <PageHeader title={client.name} subtitle="One profile · the client's entire story." />

      {activeFlags.length > 0 ? (
        <div className="mb-5 space-y-2">
          {activeFlags.map((flag) => {
            const Icon = sourceIcon[flag.source];
            return (
              <div
                key={flag.id}
                className="flex flex-col gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 animate-pulse-slow sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-red-200">
                      Active urgency flag <SeverityBadge severity={flag.severity} />
                    </p>
                    <p className="mt-0.5 text-sm text-red-300/90">{flag.reason}</p>
                    {flag.triggerSnippet ? (
                      <p className="mt-1 text-xs italic text-red-300/70">
                        “{flag.triggerSnippet}”
                      </p>
                    ) : null}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    store.resolveFlag(flag.id, "Client reassured, scheduling portfolio review.")
                  }
                >
                  Resolve flag
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody>
            <div className="flex flex-col items-center text-center">
              <Image
                src={client.photo}
                alt={client.name}
                width={88}
                height={88}
                className="h-[88px] w-[88px] rounded-2xl object-cover ring-1 ring-border"
                unoptimized
              />
              <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {client.name}
              </h2>
              <p className="text-sm text-muted">{client.email}</p>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Portfolio</dt>
                <dd className="flex items-center gap-2 font-medium text-foreground">
                  ${(client.portfolioValue / 1_000_000).toFixed(2)}M
                  <span
                    className={`flex items-center gap-0.5 font-mono text-xs ${
                      up ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {up ? "+" : ""}
                    {client.portfolioChangePct}%
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Risk tolerance</dt>
                <dd className="font-medium text-foreground">{client.riskTolerance}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Risk profile updated</dt>
                <dd className="font-medium text-foreground">{client.riskProfileUpdated}</dd>
              </div>
            </dl>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-4"
              onClick={() => store.refreshRiskProfile(client.id)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh risk profile
            </Button>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Complexity tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {client.complexityTags.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Chat & Notes"
              icon={<MessageSquare className="h-4 w-4" />}
              action={
                <Link href="/advisor/chat">
                  <Button size="sm" variant="ghost">
                    Open chat
                  </Button>
                </Link>
              }
            />
            <CardBody className="space-y-2.5">
              {messages.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">No messages yet.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl border px-3 py-2 ${
                      m.noteFlag
                        ? "border-blue-400/30 bg-blue-500/10"
                        : "border-border bg-foreground/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold capitalize text-foreground">
                        {m.sender}
                      </span>
                      {m.noteFlag ? <Badge tone="blue">Note</Badge> : null}
                      {m.tags.includes("follow-up needed") ? (
                        <Badge tone="red">Follow-up</Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/80">{m.body}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader title="Next Meeting" icon={<CalendarClock className="h-4 w-4" />} />
              <CardBody>
                {meeting ? (
                  <div
                    className={`rounded-xl border px-3 py-3 ${
                      meeting.urgencyFlagId ? "border-red-400/40 bg-red-500/10" : "border-border"
                    }`}
                  >
                    <p className="text-sm font-medium capitalize text-foreground">
                      {meeting.type} meeting
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {meeting.date} · {meeting.time} · {meeting.durationMinutes} min
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted">No upcoming meeting.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Linked Partners" icon={<Network className="h-4 w-4" />} />
              <CardBody className="space-y-2">
                {partners.length === 0 ? (
                  <p className="text-sm text-muted">No linked partners.</p>
                ) : (
                  partners.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted">{p.type}</p>
                      </div>
                      <Badge tone={p.satisfactionScore >= 80 ? "green" : p.satisfactionScore >= 60 ? "amber" : "red"}>
                        {p.satisfactionScore}
                      </Badge>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Recommended CPD"
              description="Skill gaps mapped from this client's complexity."
              icon={<GraduationCap className="h-4 w-4" />}
            />
            <CardBody className="space-y-2">
              {gaps.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-emerald-300">
                  <Target className="h-4 w-4" /> No skill gaps — you&apos;re covered for this client.
                </p>
              ) : (
                gaps.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{course.title}</p>
                      <p className="text-xs text-muted">{course.cpdHours} CPD hrs · {course.complexityTag}</p>
                    </div>
                    {course.status === "recommended" ? (
                      <Button size="sm" onClick={() => store.enrollCourse(course.id)}>
                        Enroll
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => store.completeCourse(course.id)}>
                        Complete
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
