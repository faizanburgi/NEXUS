"use client";

import Image from "next/image";
import {
  Award,
  Clock,
  GraduationCap,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { CpdRing } from "@/components/ui/CpdRing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";

export default function AdvisorProfilePage() {
  const store = useStore();
  const advisor = store.getAdvisor();
  const courses = store.getCourses();
  const enrolled = courses.filter((c) => c.status === "enrolled");
  const completed = courses.filter((c) => c.status === "completed");

  return (
    <>
      <PageHeader
        title="Advisor Profile"
        subtitle="Your credentials and live CPD compliance."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Image
              src={advisor.photo}
              alt={advisor.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover ring-1 ring-border"
              unoptimized
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {advisor.name}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                <ShieldCheck className="h-4 w-4" />
                License {advisor.license}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {advisor.specializations.map((s) => (
                  <Badge key={s} tone="blue">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  {advisor.yearsExperience} yrs experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4" />
                  {advisor.languages.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {advisor.availability}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="CPD Ring" description="Live this cycle" />
          <CardBody className="flex flex-col items-center gap-2 py-6">
            <CpdRing value={advisor.cpdCompleted} max={advisor.cpdRequired} size={150} />
            <p className="text-center text-sm text-muted">
              {advisor.cpdRequired - advisor.cpdCompleted} hours remaining to stay compliant
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Hours completed"
          value={String(advisor.cpdCompleted)}
          hint={`of ${advisor.cpdRequired} required`}
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <StatCard
          label="Courses enrolled"
          value={String(enrolled.length)}
          hint="In progress"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="Courses completed"
          value={String(completed.length)}
          hint="This cycle"
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      <Card className="mt-5">
        <CardHeader
          title="CPD Pipeline"
          description="Complete a course to watch the ring climb in real time."
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <CardBody className="space-y-2.5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-3 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{course.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                  <Badge tone="neutral">{course.complexityTag}</Badge>
                  {course.cpdHours} CPD hrs
                </p>
              </div>
              <div className="flex items-center gap-2">
                {course.status === "completed" ? (
                  <Badge tone="green">Completed</Badge>
                ) : course.status === "enrolled" ? (
                  <Button size="sm" onClick={() => store.completeCourse(course.id)}>
                    Complete course
                  </Button>
                ) : (
                  <>
                    <Badge tone="amber">Recommended</Badge>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => store.enrollCourse(course.id)}
                    >
                      Enroll
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
