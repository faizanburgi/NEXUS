"use client";

import { Check, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ClientService } from "@/services";

export default function ClientProgressPage() {
  const goals = ClientService.getGoals();
  const overall = ClientService.getOverallProgress();
  const completedSteps = goals.reduce(
    (sum, g) => sum + g.steps.filter((s) => s.completed).length,
    0
  );
  const totalSteps = goals.reduce((sum, g) => sum + g.steps.length, 0);

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Track your financial and consulting goals."
      />

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Overall progress"
          value={`${overall}%`}
          hint="Weighted across goals"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Active goals"
          value={String(goals.length)}
          hint="In progress"
          icon={<Target className="h-4 w-4" />}
        />
        <StatCard
          label="Steps completed"
          value={`${completedSteps}/${totalSteps}`}
          hint="Across all goals"
          icon={<Check className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {goals.map((goal, index) => (
          <Card
            key={goal.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader title={goal.title} description={goal.description} />
            <CardBody className="space-y-4">
              <ProgressBar value={goal.progress} showValue />
              <ul className="space-y-2">
                {goal.steps.map((step) => (
                  <li key={step.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        step.completed
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-border bg-transparent text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span
                      className={`text-sm ${
                        step.completed
                          ? "text-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
