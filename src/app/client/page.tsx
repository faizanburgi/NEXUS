"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  CircleDot,
  Heart,
  Send,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CpdRing } from "@/components/ui/CpdRing";
import { useStore } from "@/lib/useStore";
import { AiAssistant } from "@/components/ui/AiAssistant";
import { DEMO_CLIENT_ID } from "@/services/NexusStore";

type StepState = "completed" | "active" | "pending";
interface Step {
  id: number;
  title: string;
  state: StepState;
}

export default function ClientEngagementPage() {
  const store = useStore();
  const advisor = store.getAdvisor();
  const myFlags = store.getClientFlags(DEMO_CLIENT_ID);

  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Account Review & Structuring", state: "completed" },
    { id: 2, title: "External Partner SLA Synchronization", state: "active" },
    { id: 3, title: "Incorporation & Asset Custody", state: "pending" },
    { id: 4, title: "Final Compliance Sign-off", state: "pending" },
  ]);
  const [update, setUpdate] = useState("");
  const [awarded, setAwarded] = useState(0);
  const [thanks, setThanks] = useState(false);

  const advance = (stepId: number) =>
    setSteps((prev) => {
      const next = prev.map((s) => ({ ...s }));
      const i = next.findIndex((s) => s.id === stepId);
      if (i === -1) return prev;
      if (next[i].state === "active") {
        next[i].state = "completed";
        if (next[i + 1]) next[i + 1].state = "active";
      } else if (next[i].state === "pending") {
        next[i].state = "active";
      }
      return next;
    });

  const sendUpdate = () => {
    const text = update.trim();
    if (!text) return;
    store.createFlag(DEMO_CLIENT_ID, "manual", "high", `Client immediate update: ${text}`, text);
    setUpdate("");
  };

  const award = (points: number) => {
    store.awardDevelopmentPoints(points);
    setAwarded((a) => a + points);
    setThanks(true);
    window.setTimeout(() => setThanks(false), 1800);
  };

  return (
    <>
      <PageHeader
        title="My Engagement"
        subtitle="Track your account, reach your advisor instantly, and recognize great service."
      />

      <div className="mb-5 flex items-center gap-2 text-xs text-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono tracking-wide">
          NODE ID: ASG-X-0492 · <span className="text-emerald-400">Network Verified Secure</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Engagement pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Account Engagement Pipeline"
            description="Live milestones across your advisory journey."
            icon={<CircleDot className="h-4 w-4" />}
          />
          <CardBody>
            <ol className="relative">
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <li key={step.id} className="relative pl-9 pb-5 last:pb-0">
                    {!last ? (
                      <span
                        className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-px ${
                          step.state === "completed" ? "bg-cyan-500/50" : "bg-border"
                        }`}
                      />
                    ) : null}
                    <span className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center">
                      {step.state === "completed" ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : step.state === "active" ? (
                        <span className="relative flex h-6 w-6 items-center justify-center">
                          <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-amber-500/40" />
                          <span className="relative flex h-3.5 w-3.5 rounded-full bg-amber-400 ring-4 ring-amber-500/20" />
                        </span>
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-border bg-foreground/5" />
                      )}
                    </span>
                    <button
                      onClick={() => advance(step.id)}
                      disabled={step.state === "completed"}
                      className="block w-full text-left disabled:cursor-default"
                    >
                      <p
                        className={`text-[13px] font-medium ${
                          step.state === "pending" ? "text-muted" : "text-foreground"
                        }`}
                      >
                        Step {step.id}: {step.title}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          step.state === "completed"
                            ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30"
                            : step.state === "active"
                            ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                            : "bg-foreground/5 text-muted ring-1 ring-border"
                        }`}
                      >
                        {step.state === "completed"
                          ? "Completed"
                          : step.state === "active"
                          ? "In Progress · tap to advance"
                          : "Pending"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>

        {/* Recognize advisor → CPD */}
        <Card>
          <CardHeader
            title="Recognize Your Advisor"
            description="Award development points — they boost CPD."
            icon={<Heart className="h-4 w-4" />}
          />
          <CardBody className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5 self-stretch rounded-xl border border-border bg-foreground/5 px-3 py-2">
              <Image
                src={advisor.photo}
                alt={advisor.name}
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-border"
              />
              <div className="leading-tight">
                <p className="text-sm font-medium text-foreground">{advisor.name}</p>
                <p className="text-[11px] text-muted">Your enterprise advisor</p>
              </div>
            </div>

            <CpdRing value={advisor.cpdCompleted} max={advisor.cpdRequired} size={128} />

            <div className="flex w-full gap-2">
              {[1, 2, 5].map((p) => (
                <Button key={p} size="sm" variant="secondary" fullWidth onClick={() => award(p)}>
                  <Award className="h-3.5 w-3.5" />+{p}
                </Button>
              ))}
            </div>
            <p className="text-center text-[11px] text-muted">
              {thanks ? (
                <span className="font-medium text-emerald-400">
                  Thank you! +{awarded} CPD hrs credited to your advisor.
                </span>
              ) : (
                "Points are added to your advisor's CPD compliance instantly."
              )}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Immediate update → advisor urgency */}
      <Card className="mt-5">
        <CardHeader
          title="Log an Immediate Update"
          description="Reaches your advisor's Urgency Feed in real time."
          icon={<AlertTriangle className="h-4 w-4" />}
          action={<Badge tone="red">Priority channel</Badge>}
        />
        <CardBody>
          <div className="flex items-end gap-2">
            <textarea
              value={update}
              onChange={(e) => setUpdate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUpdate();
                }
              }}
              rows={1}
              placeholder="e.g. I need to discuss my portfolio urgently…"
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
            <Button onClick={sendUpdate}>
              <Send className="h-4 w-4" />
              Send to advisor
            </Button>
          </div>

          {myFlags.length > 0 ? (
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Your recent updates
              </p>
              {myFlags.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-foreground/80">
                    <Sparkles className="h-3.5 w-3.5 text-muted" />
                    {f.triggerSnippet ?? f.reason}
                  </span>
                  <Badge tone={f.resolved ? "green" : "amber"}>
                    {f.resolved ? "Advisor resolved" : "Sent"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : null}
        </CardBody>
      </Card>

      <AiAssistant />
    </>
  );
}
