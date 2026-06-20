"use client";

import { Mail, MapPin, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ClientService } from "@/services";

export default function ClientPartnersPage() {
  const partners = ClientService.getAssignedPartners();

  return (
    <>
      <PageHeader
        title="Assigned Partners"
        subtitle="Specialists your advisor has connected you with."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {partners.map((partner, index) => (
          <Card
            key={partner.id}
            interactive
            className="animate-fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-sm font-semibold text-foreground">
                    {partner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-foreground">
                      {partner.name}
                    </p>
                    <p className="text-xs text-muted">{partner.firm}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {partner.rating}
                </span>
              </div>

              <div className="mt-4">
                <Badge tone="blue">{partner.category}</Badge>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4" />
                {partner.location}
              </p>

              <Button size="sm" fullWidth className="mt-4">
                <Mail className="h-4 w-4" />
                Message partner
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
