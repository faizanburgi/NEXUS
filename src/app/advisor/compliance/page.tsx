"use client";

import {
  CheckCircle2,
  FileCheck,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  TimerReset,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/lib/useStore";
import type { AuditEventType } from "@/types";

const eventLabel: Record<AuditEventType, string> = {
  advice_given: "Advice documented",
  risk_profile_updated: "Risk profile updated",
  complaint_logged: "Complaint logged",
  cpd_completed: "CPD completed",
  urgency_resolved: "Urgency resolved",
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdvisorCompliancePage() {
  const store = useStore();
  const audit = store.getAuditReadiness();
  const events = store.getAuditEvents();

  return (
    <>
      <PageHeader
        title="Audit Readiness"
        subtitle="Every action is already audit-evidence — continuously, not in a scramble."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Composite Score" icon={<ShieldCheck className="h-4 w-4" />} />
          <CardBody className="flex flex-col items-center justify-center py-8">
            <div className={`text-6xl font-semibold tracking-tight ${scoreColor(audit.score)}`}>
              {audit.score}
            </div>
            <p className="mt-1 text-sm text-muted">out of 100</p>
            <Badge tone={audit.score >= 80 ? "green" : audit.score >= 60 ? "amber" : "red"}>
              {audit.score >= 80 ? "Audit-ready" : audit.score >= 60 ? "Minor gaps" : "Action needed"}
            </Badge>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Breakdown"
            description="Resolve an urgency flag and watch Complaint Resolution tick up."
          />
          <CardBody className="space-y-5 py-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-muted" />
              <div className="flex-1">
                <ScoreBar label="CPD Compliance" value={audit.cpdCompliance} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserCheck className="h-4 w-4 text-muted" />
              <div className="flex-1">
                <ScoreBar label="Risk Profile Currency" value={audit.riskCurrency} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimerReset className="h-4 w-4 text-muted" />
              <div className="flex-1">
                <ScoreBar label="Complaint Resolution Time" value={audit.complaintResolution} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileCheck className="h-4 w-4 text-muted" />
              <div className="flex-1">
                <ScoreBar label="Advice Documentation" value={audit.docCompleteness} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader
          title="Immutable Audit Log"
          description="Timestamped evidence chain assembled automatically."
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <CardBody className="space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {eventLabel[e.eventType]}
                  </p>
                  <p className="text-xs text-muted">
                    {e.clientId ? store.clientName(e.clientId) : "Firm-wide"} · evidence{" "}
                    <span className="font-mono">{e.evidenceRef}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="green">{e.status === "compliant" ? "Compliant" : e.status}</Badge>
                <span className="font-mono text-[11px] text-muted">{relativeTime(e.timestamp)}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
