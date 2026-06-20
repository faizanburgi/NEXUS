"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, ChevronRight, Search, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/lib/useStore";
import type { ClientStatus } from "@/types";

const statusTone: Record<ClientStatus, "green" | "blue" | "red" | "neutral"> = {
  Active: "green",
  Onboarding: "blue",
  "At Risk": "red",
  Dormant: "neutral",
};

export default function AdvisorClientsPage() {
  const store = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const clients = store.getClients();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.complexityTags.some((t) => t.toLowerCase().includes(q))
    );
  }, [clients, query]);

  return (
    <>
      <PageHeader
        title="Client Library"
        subtitle="Complexity tags surface skill gaps and CPD recommendations."
      />

      <div className="mb-5 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients or complexity tags…"
          className="h-10 w-full rounded-xl border border-border bg-surface/70 pl-9 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((client, index) => {
          const gaps = store.getRecommendedCoursesForClient(client.id);
          const active = store.hasActiveFlag(client.id);
          const up = client.portfolioChangePct >= 0;
          return (
            <Card
              key={client.id}
              interactive
              className="cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => router.push(`/advisor/clients/${client.id}`)}
            >
              <CardBody>
                <div className="flex items-start gap-3">
                  <Image
                    src={client.photo}
                    alt={client.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold tracking-tight text-foreground">
                        {client.name}
                      </p>
                      {active ? <Badge tone="red">Urgent</Badge> : null}
                    </div>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                      <Badge tone={statusTone[client.status]}>{client.status}</Badge>
                      <span
                        className={`flex items-center gap-1 font-mono text-xs ${
                          up ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {up ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {up ? "+" : ""}
                        {client.portfolioChangePct}%
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {client.complexityTags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {gaps.length > 0 ? (
                  <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-amber-200">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Skill gap detected — recommended: {gaps.map((g) => g.title).join(", ")}
                    </p>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
