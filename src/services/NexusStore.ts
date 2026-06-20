import type {
  AdvisorProfile,
  AuditEvent,
  AuditEventType,
  CalendarMeeting,
  ChatMessage,
  ChatSender,
  CpdCourse,
  EcoPartner,
  FlagSource,
  MeetingType,
  NexusClient,
  Reminder,
  Severity,
  UrgencyFlag,
} from "@/types";

/** The logged-in demo client's identity in the store (see AuthService). */
export const DEMO_CLIENT_ID = "cli-alex";

let seq = 0;
const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

// Chat trigger keywords → auto urgency flag (Chat Box → Urgency Flagging link).
const TRIGGERS: { keyword: string; severity: Severity }[] = [
  { keyword: "withdraw", severity: "high" },
  { keyword: "withdrawal", severity: "high" },
  { keyword: "close my account", severity: "high" },
  { keyword: "complaint", severity: "high" },
  { keyword: "asap", severity: "med" },
  { keyword: "worried", severity: "med" },
  { keyword: "anxious", severity: "med" },
  { keyword: "losses", severity: "med" },
  { keyword: "losing", severity: "med" },
  { keyword: "unhappy", severity: "med" },
];

/**
 * NexusStore is the single reactive in-memory backend that connects every
 * section of the platform. Mutations bump a version counter and notify
 * subscribers, so `useSyncExternalStore` consumers re-render live — this is
 * what powers the cross-section demo moments (complete a course → CPD ring
 * climbs; trigger chat → urgency flag spawns; resolve flag → audit score ticks).
 */
class NexusStoreImpl {
  private version = 0;
  private listeners = new Set<() => void>();

  private advisor: AdvisorProfile = {
    id: "adv-001",
    name: "Admin Advisor",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    license: "MAS-FA-2031-8842",
    specializations: ["Retirement", "Estate Planning", "Tax"],
    yearsExperience: 11,
    cpdCompleted: 18,
    cpdRequired: 40,
    languages: ["English", "Mandarin", "Malay"],
    availability: "Mon–Fri · 09:00–18:00 SGT",
  };

  private clients: NexusClient[] = [
    {
      id: "cli-001",
      name: "Sarah Tan",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      email: "sarah.tan@example.com",
      advisorId: "adv-001",
      portfolioValue: 1240000,
      portfolioChangePct: -12,
      riskTolerance: "Balanced",
      goals: ["Retire at 60", "Fund children's education"],
      complexityTags: ["Cross-Border Tax", "Trust Structuring"],
      partnerIds: ["par-001"],
      riskProfileUpdated: "2025-11-02",
      status: "At Risk",
      lastContact: "Today",
    },
    {
      id: "cli-002",
      name: "Daniel Okafor",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      email: "d.okafor@example.com",
      advisorId: "adv-001",
      portfolioValue: 2050000,
      portfolioChangePct: 4,
      riskTolerance: "Growth",
      goals: ["Wealth preservation"],
      complexityTags: ["Crypto Assets"],
      partnerIds: ["par-003"],
      riskProfileUpdated: "2026-05-19",
      status: "Active",
      lastContact: "3 days ago",
    },
    {
      id: "cli-003",
      name: "Mei Lin",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      email: "mei.lin@example.com",
      advisorId: "adv-001",
      portfolioValue: 960000,
      portfolioChangePct: 7,
      riskTolerance: "Conservative",
      goals: ["Stable income"],
      complexityTags: ["Estate Planning"],
      partnerIds: ["par-002"],
      riskProfileUpdated: "2024-09-10",
      status: "Active",
      lastContact: "1 week ago",
    },
    {
      id: "cli-alex",
      name: "Alex Carter",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      email: "alex@client.io",
      advisorId: "adv-001",
      portfolioValue: 850000,
      portfolioChangePct: 6,
      riskTolerance: "Balanced",
      goals: ["Retire at 62", "Buy a second property"],
      complexityTags: ["Retirement", "Estate Planning"],
      partnerIds: ["par-004"],
      riskProfileUpdated: "2026-03-15",
      status: "Active",
      lastContact: "Today",
    },
    {
      id: "cli-004",
      name: "Hannah Weber",
      photo:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
      email: "h.weber@example.com",
      advisorId: "adv-001",
      portfolioValue: 1780000,
      portfolioChangePct: 2,
      riskTolerance: "Balanced",
      goals: ["Early retirement"],
      complexityTags: ["Cross-Border Tax"],
      partnerIds: ["par-001", "par-004"],
      riskProfileUpdated: "2026-02-21",
      status: "Onboarding",
      lastContact: "Yesterday",
    },
  ];

  private courses: CpdCourse[] = [
    { id: "crs-001", title: "International Tax Fundamentals", cpdHours: 3, complexityTag: "Cross-Border Tax", status: "recommended" },
    { id: "crs-002", title: "Digital Assets Advisory", cpdHours: 4, complexityTag: "Crypto Assets", status: "recommended" },
    { id: "crs-003", title: "Advanced Trust Structuring", cpdHours: 5, complexityTag: "Trust Structuring", status: "recommended" },
    { id: "crs-004", title: "Estate Planning Essentials", cpdHours: 3, complexityTag: "Estate Planning", status: "enrolled" },
    { id: "crs-005", title: "Behavioural Finance", cpdHours: 2, complexityTag: "Client Psychology", status: "completed" },
    { id: "crs-006", title: "AML & Compliance Refresher", cpdHours: 6, complexityTag: "Compliance", status: "completed" },
  ];

  private partners: EcoPartner[] = [
    { id: "par-001", name: "ABC Law Firm", type: "Law Firm", satisfactionScore: 88, relationshipStrength: 0.9, sharedClientIds: ["cli-001", "cli-004"], lastInteraction: "2 days ago" },
    { id: "par-002", name: "Meridian Estate Law", type: "Law Firm", satisfactionScore: 72, relationshipStrength: 0.5, sharedClientIds: ["cli-003"], lastInteraction: "3 weeks ago" },
    { id: "par-003", name: "Summit Fund Managers", type: "Fund Manager", satisfactionScore: 81, relationshipStrength: 0.7, sharedClientIds: ["cli-002"], lastInteraction: "5 days ago" },
    { id: "par-004", name: "Whitfield Accountants", type: "Accountant", satisfactionScore: 94, relationshipStrength: 0.95, sharedClientIds: ["cli-004"], lastInteraction: "Yesterday" },
    { id: "par-005", name: "Sentinel Insurance", type: "Insurance", satisfactionScore: 67, relationshipStrength: 0.4, sharedClientIds: [], lastInteraction: "2 months ago" },
  ];

  private meetings: CalendarMeeting[] = [
    { id: "mtg-001", advisorId: "adv-001", clientId: "cli-001", date: "Today", time: "14:30", durationMinutes: 45, type: "review", status: "scheduled", urgencyFlagId: null },
    { id: "mtg-002", advisorId: "adv-001", clientId: "cli-002", date: "Today", time: "16:00", durationMinutes: 30, type: "planning", status: "scheduled", urgencyFlagId: null },
    { id: "mtg-003", advisorId: "adv-001", clientId: "cli-004", date: "Tomorrow", time: "10:00", durationMinutes: 60, type: "onboarding", status: "scheduled", urgencyFlagId: null },
    { id: "mtg-004", advisorId: "adv-001", clientId: "cli-003", date: "Fri", time: "11:30", durationMinutes: 30, type: "review", status: "scheduled", urgencyFlagId: null },
    { id: "mtg-alex", advisorId: "adv-001", clientId: "cli-alex", date: "Tomorrow", time: "15:00", durationMinutes: 30, type: "review", status: "scheduled", urgencyFlagId: null },
  ];

  private reminders: Reminder[] = [];

  private messages: ChatMessage[] = [
    { id: "msg-001", clientId: "cli-001", sender: "client", timestamp: Date.now() - 1000 * 60 * 60 * 5, body: "Hi, just checking in on my portfolio.", noteFlag: false, tags: [] },
    { id: "msg-002", clientId: "cli-001", sender: "advisor", timestamp: Date.now() - 1000 * 60 * 60 * 4.5, body: "Of course — markets have been volatile but your plan is on track.", noteFlag: false, tags: [] },
    { id: "msg-003", clientId: "cli-002", sender: "client", timestamp: Date.now() - 1000 * 60 * 60 * 24, body: "Thanks for the update last week.", noteFlag: false, tags: [] },
    { id: "msg-alex-1", clientId: "cli-alex", sender: "advisor", timestamp: Date.now() - 1000 * 60 * 60 * 3, body: "Hi Alex — welcome to Nexus. I'm your assigned advisor; message me anytime.", noteFlag: false, tags: [] },
  ];

  private flags: UrgencyFlag[] = [
    {
      id: "flg-seed-1",
      clientId: "cli-001",
      source: "portfolio",
      severity: "high",
      reason: "Portfolio drawdown of 12% this quarter",
      createdAt: Date.now() - 1000 * 60 * 30,
      resolved: false,
    },
  ];

  private audit: AuditEvent[] = [
    { id: "aud-001", source: "cpd", clientId: null, advisorId: "adv-001", eventType: "cpd_completed", timestamp: Date.now() - 1000 * 60 * 60 * 48, evidenceRef: "crs-006", status: "compliant" },
    { id: "aud-002", source: "chat", clientId: "cli-002", advisorId: "adv-001", eventType: "advice_given", timestamp: Date.now() - 1000 * 60 * 60 * 20, evidenceRef: "msg-003", status: "compliant" },
  ];

  /* ---------- reactivity ---------- */
  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  getSnapshot = (): number => this.version;
  getServerSnapshot = (): number => 0;

  private commit(): void {
    this.version += 1;
    this.listeners.forEach((cb) => cb());
  }

  /* ---------- readers ---------- */
  getAdvisor(): AdvisorProfile {
    return this.advisor;
  }
  getClients(): NexusClient[] {
    return this.clients;
  }
  getClient(clientId: string): NexusClient | undefined {
    return this.clients.find((c) => c.id === clientId);
  }
  getCourses(): CpdCourse[] {
    return this.courses;
  }
  getPartners(): EcoPartner[] {
    return this.partners;
  }
  getPartner(partnerId: string): EcoPartner | undefined {
    return this.partners.find((p) => p.id === partnerId);
  }
  getMeetings(): CalendarMeeting[] {
    // Urgent flagged clients float to the top of today's agenda.
    return [...this.meetings].sort((a, b) => {
      const aFlag = this.hasActiveFlag(a.clientId) ? 0 : 1;
      const bFlag = this.hasActiveFlag(b.clientId) ? 0 : 1;
      if (aFlag !== bFlag) return aFlag - bFlag;
      return a.date === "Today" ? -1 : 1;
    });
  }
  getMessages(clientId: string): ChatMessage[] {
    return this.messages.filter((m) => m.clientId === clientId);
  }
  getClientMeetings(clientId: string): CalendarMeeting[] {
    return this.meetings
      .filter((m) => m.clientId === clientId)
      .sort((a) => (a.date === "Today" ? -1 : 1));
  }
  getReminders(): Reminder[] {
    return [...this.reminders].sort((a, b) => b.createdAt - a.createdAt);
  }
  getActiveReminders(): Reminder[] {
    return this.getReminders().filter((r) => !r.done);
  }
  getFlags(): UrgencyFlag[] {
    return [...this.flags].sort((a, b) => b.createdAt - a.createdAt);
  }
  getActiveFlags(): UrgencyFlag[] {
    return this.getFlags().filter((f) => !f.resolved);
  }
  getClientFlags(clientId: string): UrgencyFlag[] {
    return this.getFlags().filter((f) => f.clientId === clientId);
  }
  hasActiveFlag(clientId: string): boolean {
    return this.flags.some((f) => f.clientId === clientId && !f.resolved);
  }
  getAuditEvents(): AuditEvent[] {
    return [...this.audit].sort((a, b) => b.timestamp - a.timestamp);
  }

  getRecommendedCoursesForClient(clientId: string): CpdCourse[] {
    const client = this.getClient(clientId);
    if (!client) return [];
    return this.courses.filter(
      (c) => client.complexityTags.includes(c.complexityTag) && c.status !== "completed"
    );
  }

  clientName(clientId: string | null): string {
    if (!clientId) return "—";
    return this.getClient(clientId)?.name ?? clientId;
  }

  /* ---------- audit readiness composite ---------- */
  getAuditReadiness(): {
    score: number;
    cpdCompliance: number;
    riskCurrency: number;
    complaintResolution: number;
    docCompleteness: number;
  } {
    const cpdCompliance = Math.min(
      100,
      Math.round((this.advisor.cpdCompleted / this.advisor.cpdRequired) * 100)
    );

    const now = Date.now();
    const yearMs = 1000 * 60 * 60 * 24 * 365;
    const current = this.clients.filter(
      (c) => now - new Date(c.riskProfileUpdated).getTime() < yearMs
    ).length;
    const riskCurrency = this.clients.length
      ? Math.round((current / this.clients.length) * 100)
      : 100;

    const resolvedFlags = this.flags.filter((f) => f.resolved);
    const totalFlags = this.flags.length;
    const complaintResolution = totalFlags
      ? Math.round((resolvedFlags.length / totalFlags) * 100)
      : 100;

    const notes = this.messages.filter((m) => m.noteFlag).length;
    const docCompleteness = Math.min(100, 60 + notes * 8);

    const score = Math.round(
      cpdCompliance * 0.3 +
        riskCurrency * 0.25 +
        complaintResolution * 0.25 +
        docCompleteness * 0.2
    );

    return { score, cpdCompliance, riskCurrency, complaintResolution, docCompleteness };
  }

  /* ---------- mutations (the connected actions) ---------- */
  private logAudit(
    eventType: AuditEventType,
    source: AuditEvent["source"],
    advisorId: string,
    clientId: string | null,
    evidenceRef: string
  ): void {
    this.audit.push({
      id: id("aud"),
      source,
      clientId,
      advisorId,
      eventType,
      timestamp: Date.now(),
      evidenceRef,
      status: "compliant",
    });
  }

  /** Client Library → CPD Pipeline → Advisor Profile CPD ring. */
  completeCourse(courseId: string): void {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course || course.status === "completed") return;
    course.status = "completed";
    this.advisor.cpdCompleted = Math.min(
      this.advisor.cpdRequired,
      this.advisor.cpdCompleted + course.cpdHours
    );
    this.logAudit("cpd_completed", "cpd", this.advisor.id, null, course.id);
    this.commit();
  }

  enrollCourse(courseId: string): void {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course || course.status !== "recommended") return;
    course.status = "enrolled";
    this.commit();
  }

  /** Client recognition → development points added to the advisor's CPD. */
  awardDevelopmentPoints(points: number): void {
    if (points <= 0) return;
    this.advisor.cpdCompleted = Math.min(
      this.advisor.cpdRequired,
      this.advisor.cpdCompleted + points
    );
    this.logAudit("cpd_completed", "cpd", this.advisor.id, DEMO_CLIENT_ID, `dev-points-${points}`);
    this.commit();
  }

  /** Client books a meeting → scheduled entry + a reminder for the advisor. */
  bookMeeting(
    clientId: string,
    date: string,
    time: string,
    type: MeetingType,
    durationMinutes = 30
  ): string {
    const meeting: CalendarMeeting = {
      id: id("mtg"),
      advisorId: this.advisor.id,
      clientId,
      date,
      time,
      durationMinutes,
      type,
      status: "scheduled",
      urgencyFlagId: null,
    };
    this.meetings.push(meeting);
    this.reminders.push({
      id: id("rem"),
      meetingId: meeting.id,
      advisorId: this.advisor.id,
      clientId,
      message: `${type[0].toUpperCase()}${type.slice(1)} with ${this.clientName(clientId)} — ${date} ${time}`,
      leadTime: "30 min before",
      createdAt: Date.now(),
      done: false,
    });
    this.commit();
    return meeting.id;
  }

  resolveReminder(reminderId: string): void {
    const r = this.reminders.find((x) => x.id === reminderId);
    if (!r || r.done) return;
    r.done = true;
    this.commit();
  }

  /** Chat Box → Urgency Flagging (keyword/sentiment trigger). */
  sendMessage(clientId: string, body: string, sender: ChatSender, asNote = false): void {
    const tags: string[] = [];
    const lower = body.toLowerCase();
    const message: ChatMessage = {
      id: id("msg"),
      clientId,
      sender,
      timestamp: Date.now(),
      body,
      noteFlag: asNote,
      tags,
    };
    this.messages.push(message);

    if (asNote) {
      tags.push("note");
      this.logAudit("advice_given", "chat", this.advisor.id, clientId, message.id);
    }

    if (sender === "client") {
      const hit = TRIGGERS.find((t) => lower.includes(t.keyword));
      if (hit) {
        tags.push("follow-up needed");
        this.createFlag(clientId, "chat", hit.severity, "Chat sentiment trigger detected", body);
      }
    }
    this.commit();
  }

  createFlag(
    clientId: string,
    source: FlagSource,
    severity: Severity,
    reason: string,
    triggerSnippet?: string
  ): string {
    const flag: UrgencyFlag = {
      id: id("flg"),
      clientId,
      source,
      severity,
      reason,
      triggerSnippet,
      createdAt: Date.now(),
      resolved: false,
    };
    this.flags.push(flag);
    // Urgency → Calendar: link/glow the client's next meeting.
    const meeting = this.meetings.find((m) => m.clientId === clientId && m.status === "scheduled");
    if (meeting) {
      meeting.urgencyFlagId = flag.id;
      meeting.date = "Today";
      meeting.type = "urgent";
    }
    this.commit();
    return flag.id;
  }

  /** Resolving a flag → audit complaint-resolution timestamp + partner goodwill. */
  resolveFlag(flagId: string, notes: string): void {
    const flag = this.flags.find((f) => f.id === flagId);
    if (!flag || flag.resolved) return;
    flag.resolved = true;
    flag.resolvedAt = Date.now();
    flag.resolutionNotes = notes;
    this.logAudit("urgency_resolved", flag.source, this.advisor.id, flag.clientId, flag.id);

    // Partner loop: a well-handled referred client nudges partner satisfaction up.
    const client = this.getClient(flag.clientId);
    client?.partnerIds.forEach((pid) => {
      const partner = this.partners.find((p) => p.id === pid);
      if (partner) {
        partner.satisfactionScore = Math.min(100, partner.satisfactionScore + 3);
        partner.relationshipStrength = Math.min(1, partner.relationshipStrength + 0.03);
        partner.lastInteraction = "Just now";
      }
    });
    this.commit();
  }

  /** Partner satisfaction drop → internal urgency flag for firm admin. */
  adjustPartnerSatisfaction(partnerId: string, delta: number): void {
    const partner = this.partners.find((p) => p.id === partnerId);
    if (!partner) return;
    partner.satisfactionScore = Math.max(0, Math.min(100, partner.satisfactionScore + delta));
    partner.relationshipStrength = Math.max(
      0.05,
      Math.min(1, partner.relationshipStrength + delta / 100)
    );
    if (partner.satisfactionScore < 60 && partner.sharedClientIds.length > 0) {
      this.createFlag(
        partner.sharedClientIds[0],
        "partner",
        "med",
        `Partner ${partner.name} relationship at risk (satisfaction ${partner.satisfactionScore})`
      );
      return;
    }
    this.commit();
  }

  /** Client Profile → risk profile currency feeds audit. */
  refreshRiskProfile(clientId: string): void {
    const client = this.getClient(clientId);
    if (!client) return;
    client.riskProfileUpdated = new Date().toISOString().slice(0, 10);
    this.logAudit("risk_profile_updated", "profile", this.advisor.id, clientId, clientId);
    this.commit();
  }
}

export const NexusStore = new NexusStoreImpl();
