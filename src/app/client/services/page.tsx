"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Banknote,
  CalendarPlus,
  Check,
  Landmark,
  MessageSquare,
  PiggyBank,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";

interface ServiceAdvisor {
  name: string;
  role: string;
  photo: string;
}

interface ServiceDef {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: string; // text color
  ring: string; // icon bg
  tagline: string;
  details: string[];
  status: "Active" | "Available";
  /** when true, the assigned (demo) advisor is injected as lead advisor */
  ledByYourAdvisor: boolean;
  advisors: ServiceAdvisor[];
}

const SERVICES: ServiceDef[] = [
  {
    id: "financial",
    name: "Financial Planning",
    icon: Banknote,
    accent: "text-cyan-400",
    ring: "bg-cyan-500/15 text-cyan-400",
    tagline: "Holistic cash-flow, savings & investment strategy.",
    details: [
      "Personal cash-flow & budgeting model",
      "Investment portfolio construction & rebalancing",
      "Emergency fund & liquidity planning",
      "Quarterly performance reviews",
    ],
    status: "Active",
    ledByYourAdvisor: false,
    advisors: [
      {
        name: "Priya Nair",
        role: "Certified Financial Planner",
        photo:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "retirement",
    name: "Retirement Planning",
    icon: PiggyBank,
    accent: "text-emerald-400",
    ring: "bg-emerald-500/15 text-emerald-400",
    tagline: "Build and protect income for life after work.",
    details: [
      "Retirement income gap analysis",
      "CPF & pension optimization",
      "Drawdown & longevity modelling",
      "Tax-efficient withdrawal sequencing",
    ],
    status: "Active",
    ledByYourAdvisor: true,
    advisors: [],
  },
  {
    id: "estate",
    name: "Estate Planning",
    icon: Landmark,
    accent: "text-purple-400",
    ring: "bg-purple-500/15 text-purple-400",
    tagline: "Structure, protect and transfer generational wealth.",
    details: [
      "Will & trust structuring",
      "Beneficiary & succession mapping",
      "Cross-border asset protection",
      "Philanthropic & legacy planning",
    ],
    status: "Active",
    ledByYourAdvisor: true,
    advisors: [
      {
        name: "Marcus Lim",
        role: "Estate & Trust Counsel",
        photo:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "tax",
    name: "Tax Advisory",
    icon: Scale,
    accent: "text-amber-400",
    ring: "bg-amber-500/15 text-amber-400",
    tagline: "Optimize tax across jurisdictions and assets.",
    details: [
      "Cross-border tax residency review",
      "Capital gains & dividend efficiency",
      "Trust & corporate structuring",
      "Annual filing readiness",
    ],
    status: "Available",
    ledByYourAdvisor: false,
    advisors: [
      {
        name: "Sofia Reyes",
        role: "International Tax Specialist",
        photo:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

function AdvisorChip({ advisor, lead }: { advisor: ServiceAdvisor; lead?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-foreground/5 px-2.5 py-1.5">
      <Image
        src={advisor.photo}
        alt={advisor.name}
        width={28}
        height={28}
        unoptimized
        className="h-7 w-7 rounded-lg object-cover ring-1 ring-border"
      />
      <div className="min-w-0 leading-tight">
        <p className="flex items-center gap-1.5 truncate text-xs font-medium text-foreground">
          {advisor.name}
          {lead ? <Badge tone="blue">Lead</Badge> : null}
        </p>
        <p className="truncate text-[11px] text-muted">{advisor.role}</p>
      </div>
    </div>
  );
}

export default function ClientServicesPage() {
  const store = useStore();
  const router = useRouter();
  const advisor = store.getAdvisor();

  return (
    <>
      <PageHeader
        title="Advisory Services"
        subtitle="Explore your services and the specialists connected to each."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {SERVICES.map((service, index) => {
          const Icon = service.icon;
          const advisors: { advisor: ServiceAdvisor; lead: boolean }[] = [];
          if (service.ledByYourAdvisor) {
            advisors.push({
              advisor: {
                name: advisor.name,
                role: `${service.name.split(" ")[0]} Specialist`,
                photo: advisor.photo,
              },
              lead: true,
            });
          }
          service.advisors.forEach((a, i) =>
            advisors.push({ advisor: a, lead: !service.ledByYourAdvisor && i === 0 })
          );

          return (
            <Card
              key={service.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${service.ring}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                        {service.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted">{service.tagline}</p>
                    </div>
                  </div>
                  <Badge tone={service.status === "Active" ? "green" : "neutral"}>
                    {service.status}
                  </Badge>
                </div>

                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {service.details.map((d) => (
                    <li key={d} className="flex items-start gap-1.5 text-[13px] text-foreground/80">
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${service.accent}`} />
                      {d}
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
                    Connected Advisors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {advisors.map(({ advisor: a, lead }) => (
                      <AdvisorChip key={a.name} advisor={a} lead={lead} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="secondary" fullWidth onClick={() => router.push("/client/chat")}>
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message advisor
                  </Button>
                  <Button size="sm" fullWidth onClick={() => router.push("/client/meetings")}>
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Book consult
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
