"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RelationshipGraph } from "@/components/ui/RelationshipGraph";
import { useStore } from "@/lib/useStore";

function scoreTone(score: number): "green" | "amber" | "red" {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
}

export default function AdvisorPartnersPage() {
  const store = useStore();
  const partners = store.getPartners();
  const [selectedId, setSelectedId] = useState<string | undefined>(partners[0]?.id);
  const selected = partners.find((p) => p.id === selectedId);

  return (
    <>
      <PageHeader
        title="Partners Directory"
        subtitle="Relationship strength, satisfaction, and value at a glance."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Relationship Graph"
            description="Node size = satisfaction · edge thickness = relationship strength."
            icon={<Users className="h-4 w-4" />}
          />
          <CardBody>
            <RelationshipGraph
              partners={partners}
              selectedId={selectedId}
              onSelect={(p) => setSelectedId(p.id)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Simulate" description="Drop a partner's satisfaction." />
          <CardBody className="space-y-3">
            {selected ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted">{selected.type}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <span className="text-sm text-muted">Satisfaction</span>
                  <Badge tone={scoreTone(selected.satisfactionScore)}>
                    {selected.satisfactionScore}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() => store.adjustPartnerSatisfaction(selected.id, -10)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                    Drop 10
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() => store.adjustPartnerSatisfaction(selected.id, 10)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Raise 10
                  </Button>
                </div>
                <p className="text-xs text-muted">
                  Dropping a partner with shared clients below 60 auto-creates an urgency flag for
                  firm admin.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">Select a partner node.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {partners.map((p, index) => (
          <Card
            key={p.id}
            interactive
            className={`cursor-pointer animate-fade-up ${
              selectedId === p.id ? "ring-2 ring-accent/40" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedId(p.id)}
          >
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-semibold tracking-tight text-foreground">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted">{p.type}</p>
                </div>
                <Badge tone={scoreTone(p.satisfactionScore)}>{p.satisfactionScore}</Badge>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-muted">
                <div className="flex items-center justify-between">
                  <span>Relationship</span>
                  <span className="font-medium text-foreground">
                    {Math.round(p.relationshipStrength * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shared clients</span>
                  <span className="font-medium text-foreground">{p.sharedClientIds.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last interaction</span>
                  <span className="font-medium text-foreground">{p.lastInteraction}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
