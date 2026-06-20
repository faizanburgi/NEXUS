import type { ActivityItem, Goal, Meeting, Partner } from "@/types";

/**
 * ClientService is the mock data access layer for the client portal. As with
 * AdvisorService, the public methods model a repository so the UI is agnostic
 * to the eventual data source.
 */
class ClientServiceImpl {
  private readonly activities: ActivityItem[] = [
    {
      id: "c1",
      time: "09:00",
      title: "Upload bank statements",
      description: "Needed before your portfolio review.",
      type: "task",
      status: "pending",
    },
    {
      id: "c2",
      time: "11:00",
      title: "Read: Retirement glide paths",
      description: "Shared by your advisor ahead of Thursday.",
      type: "message",
      status: "done",
    },
    {
      id: "c3",
      time: "14:30",
      title: "Quarterly review with Admin Advisor",
      description: "Video call — link in your meetings tab.",
      type: "meeting",
      status: "upcoming",
    },
    {
      id: "c4",
      time: "17:00",
      title: "Confirm tax specialist intro",
      description: "Your advisor connected you with Whitfield Tax.",
      type: "alert",
      status: "upcoming",
    },
  ];

  private readonly meetings: Meeting[] = [
    {
      id: "m1",
      title: "Quarterly Portfolio Review",
      advisor: "Admin Advisor",
      date: "Thu, 25 Jun",
      time: "14:30",
      durationMinutes: 45,
      mode: "Video Call",
      status: "Confirmed",
    },
    {
      id: "m2",
      title: "Tax Planning Session",
      advisor: "Admin Advisor",
      date: "Tue, 30 Jun",
      time: "10:00",
      durationMinutes: 30,
      mode: "Phone",
      status: "Pending",
    },
    {
      id: "m3",
      title: "Estate Planning Intro",
      advisor: "Admin Advisor",
      date: "Mon, 06 Jul",
      time: "16:00",
      durationMinutes: 60,
      mode: "In Person",
      status: "Confirmed",
    },
    {
      id: "m4",
      title: "Annual Strategy Kickoff",
      advisor: "Admin Advisor",
      date: "Fri, 17 Jul",
      time: "09:30",
      durationMinutes: 90,
      mode: "Video Call",
      status: "Pending",
    },
  ];

  private readonly partners: Partner[] = [
    {
      id: "p1",
      name: "Sarah Whitfield",
      firm: "Whitfield Tax Partners",
      category: "Tax Specialist",
      location: "London, UK",
      rating: 4.9,
      available: true,
    },
    {
      id: "p6",
      name: "Robert Frost",
      firm: "Frost Estate Law",
      category: "Estate Planning",
      location: "New York, US",
      rating: 4.9,
      available: true,
    },
    {
      id: "p5",
      name: "Aisha Mohammed",
      firm: "Sentinel Insurance",
      category: "Insurance",
      location: "Dubai, UAE",
      rating: 4.5,
      available: true,
    },
  ];

  private readonly goals: Goal[] = [
    {
      id: "g1",
      title: "Retirement Readiness",
      description: "Build a resilient income plan for age 60.",
      progress: 72,
      steps: [
        { id: "g1s1", label: "Define target retirement age", completed: true },
        { id: "g1s2", label: "Consolidate pension accounts", completed: true },
        { id: "g1s3", label: "Set monthly contribution", completed: true },
        { id: "g1s4", label: "Stress-test against inflation", completed: false },
      ],
    },
    {
      id: "g2",
      title: "Tax Optimization",
      description: "Use 2026 allowances efficiently.",
      progress: 40,
      steps: [
        { id: "g2s1", label: "Review current tax wrappers", completed: true },
        { id: "g2s2", label: "Meet assigned tax specialist", completed: false },
        { id: "g2s3", label: "Implement recommendations", completed: false },
      ],
    },
    {
      id: "g3",
      title: "Estate Planning",
      description: "Protect and pass on your wealth.",
      progress: 20,
      steps: [
        { id: "g3s1", label: "Draft will outline", completed: true },
        { id: "g3s2", label: "Appoint estate lawyer", completed: false },
        { id: "g3s3", label: "Set up trust structure", completed: false },
        { id: "g3s4", label: "Document beneficiaries", completed: false },
      ],
    },
  ];

  getDailyActivities(): ActivityItem[] {
    return [...this.activities];
  }

  getMeetings(): Meeting[] {
    return [...this.meetings];
  }

  getAssignedPartners(): Partner[] {
    return [...this.partners];
  }

  getGoals(): Goal[] {
    return [...this.goals];
  }

  getOverallProgress(): number {
    if (this.goals.length === 0) return 0;
    const total = this.goals.reduce((sum, g) => sum + g.progress, 0);
    return Math.round(total / this.goals.length);
  }
}

export const ClientService = new ClientServiceImpl();
