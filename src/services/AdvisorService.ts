import type {
  ActivityItem,
  ClientRecord,
  LibraryResource,
  Partner,
} from "@/types";

/**
 * AdvisorService is the mock data access layer for the advisor portal. Methods
 * are deliberately synchronous for the MVP, but the signatures mirror an async
 * repository so UI components can be migrated to a real backend without change.
 */
class AdvisorServiceImpl {
  private readonly activities: ActivityItem[] = [
    {
      id: "a1",
      time: "08:30",
      title: "Review overnight market alerts",
      description: "3 portfolios flagged for rebalancing.",
      type: "alert",
      status: "done",
    },
    {
      id: "a2",
      time: "10:00",
      title: "Onboarding call — Priya Nair",
      description: "Collect KYC documents and risk profile.",
      type: "meeting",
      status: "done",
    },
    {
      id: "a3",
      time: "12:15",
      title: "Approve partner referral",
      description: "Tax specialist intro for the Okafor account.",
      type: "task",
      status: "pending",
    },
    {
      id: "a4",
      time: "14:30",
      title: "Quarterly review — Alex Carter",
      description: "Walk through retirement glide path.",
      type: "meeting",
      status: "upcoming",
    },
    {
      id: "a5",
      time: "16:00",
      title: "Compliance training due",
      description: "Complete the new AML module in the Library.",
      type: "alert",
      status: "upcoming",
    },
  ];

  private readonly clients: ClientRecord[] = [
    {
      id: "cli-001",
      name: "Alex Carter",
      email: "alex@client.io",
      status: "Active",
      lastContact: "2 days ago",
      portfolioValue: "$1.24M",
    },
    {
      id: "cli-002",
      name: "Priya Nair",
      email: "priya.nair@example.com",
      status: "Onboarding",
      lastContact: "Today",
      portfolioValue: "$480K",
    },
    {
      id: "cli-003",
      name: "Daniel Okafor",
      email: "d.okafor@example.com",
      status: "At Risk",
      lastContact: "3 weeks ago",
      portfolioValue: "$2.05M",
    },
    {
      id: "cli-004",
      name: "Mei Lin",
      email: "mei.lin@example.com",
      status: "Active",
      lastContact: "5 days ago",
      portfolioValue: "$960K",
    },
    {
      id: "cli-005",
      name: "Tomás Rivera",
      email: "t.rivera@example.com",
      status: "Dormant",
      lastContact: "2 months ago",
      portfolioValue: "$310K",
    },
    {
      id: "cli-006",
      name: "Hannah Weber",
      email: "h.weber@example.com",
      status: "Active",
      lastContact: "Yesterday",
      portfolioValue: "$1.78M",
    },
  ];

  private readonly resources: LibraryResource[] = [
    {
      id: "r1",
      title: "Behavioural Finance in Volatile Markets",
      summary: "Coaching clients through fear and greed cycles.",
      kind: "Article",
      durationMinutes: 12,
      category: "Client Psychology",
      cpdPoints: 2,
    },
    {
      id: "r2",
      title: "2026 Tax Efficiency Masterclass",
      summary: "Structuring portfolios for the new allowances.",
      kind: "Video",
      durationMinutes: 45,
      category: "Taxation",
      cpdPoints: 5,
    },
    {
      id: "r3",
      title: "Anti-Money-Laundering Refresher",
      summary: "Mandatory annual compliance module.",
      kind: "Course",
      durationMinutes: 60,
      category: "Compliance",
      cpdPoints: 8,
    },
    {
      id: "r4",
      title: "Sustainable Investing Frameworks",
      summary: "Evaluating ESG funds beyond the marketing.",
      kind: "Article",
      durationMinutes: 9,
      category: "ESG",
      cpdPoints: 2,
    },
    {
      id: "r5",
      title: "Retirement Glide Paths Explained",
      summary: "Designing decumulation strategies that last.",
      kind: "Video",
      durationMinutes: 28,
      category: "Retirement",
      cpdPoints: 4,
    },
    {
      id: "r6",
      title: "Difficult Conversations Workshop",
      summary: "Delivering underperformance news with empathy.",
      kind: "Course",
      durationMinutes: 50,
      category: "Client Psychology",
      cpdPoints: 6,
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
      id: "p2",
      name: "Marcus Lee",
      firm: "Lee & Associates",
      category: "Lawyer",
      location: "Singapore",
      rating: 4.7,
      available: true,
    },
    {
      id: "p3",
      name: "Elena Rossi",
      firm: "Rossi Mortgage Group",
      category: "Mortgage Broker",
      location: "Milan, IT",
      rating: 4.6,
      available: false,
    },
    {
      id: "p4",
      name: "David Chen",
      firm: "Chen Accounting",
      category: "Accountant",
      location: "Sydney, AU",
      rating: 4.8,
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
    {
      id: "p6",
      name: "Robert Frost",
      firm: "Frost Estate Law",
      category: "Estate Planning",
      location: "New York, US",
      rating: 4.9,
      available: false,
    },
  ];

  getDailyActivities(): ActivityItem[] {
    return [...this.activities];
  }

  getClients(): ClientRecord[] {
    return [...this.clients];
  }

  getLibrary(): LibraryResource[] {
    return [...this.resources];
  }

  getTotalCpdPoints(): number {
    return this.resources.reduce((sum, r) => sum + r.cpdPoints, 0);
  }

  getPartners(): Partner[] {
    return [...this.partners];
  }
}

export const AdvisorService = new AdvisorServiceImpl();
