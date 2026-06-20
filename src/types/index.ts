export type Role = "ADVISOR" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export type ActivityType = "task" | "alert" | "meeting" | "message";
export type ActivityStatus = "done" | "pending" | "upcoming";

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
}

export type ClientStatus = "Active" | "Onboarding" | "At Risk" | "Dormant";

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  lastContact: string;
  portfolioValue: string;
}

export type ResourceKind = "Article" | "Video" | "Course";

export interface LibraryResource {
  id: string;
  title: string;
  summary: string;
  kind: ResourceKind;
  durationMinutes: number;
  category: string;
  cpdPoints: number;
}

export type PartnerCategory =
  | "Tax Specialist"
  | "Lawyer"
  | "Mortgage Broker"
  | "Accountant"
  | "Insurance"
  | "Estate Planning";

export interface Partner {
  id: string;
  name: string;
  firm: string;
  category: PartnerCategory;
  location: string;
  rating: number;
  available: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  advisor: string;
  date: string;
  time: string;
  durationMinutes: number;
  mode: "Video Call" | "In Person" | "Phone";
  status: "Confirmed" | "Pending" | "Completed";
}

export interface GoalStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  steps: GoalStep[];
}

/* ============================================================
 * Nexus connected-system domain model (Advisor portal)
 * ============================================================ */

export type Severity = "low" | "med" | "high";
export type FlagSource = "chat" | "partner" | "calendar" | "portfolio" | "manual";

export interface AdvisorProfile {
  id: string;
  name: string;
  photo: string;
  license: string;
  specializations: string[];
  yearsExperience: number;
  cpdCompleted: number;
  cpdRequired: number;
  languages: string[];
  availability: string;
}

export type CourseStatus = "recommended" | "enrolled" | "completed";

export interface CpdCourse {
  id: string;
  title: string;
  cpdHours: number;
  complexityTag: string;
  status: CourseStatus;
}

export interface NexusClient {
  id: string;
  name: string;
  photo: string;
  email: string;
  advisorId: string;
  portfolioValue: number;
  portfolioChangePct: number;
  riskTolerance: "Conservative" | "Balanced" | "Growth" | "Aggressive";
  goals: string[];
  complexityTags: string[];
  partnerIds: string[];
  riskProfileUpdated: string;
  status: ClientStatus;
  lastContact: string;
}

export type PartnerType =
  | "Law Firm"
  | "Bank"
  | "Accountant"
  | "Fund Manager"
  | "Tax Specialist"
  | "Insurance";

export interface EcoPartner {
  id: string;
  name: string;
  type: PartnerType;
  satisfactionScore: number;
  relationshipStrength: number;
  sharedClientIds: string[];
  lastInteraction: string;
}

export type MeetingType = "review" | "onboarding" | "urgent" | "planning";
export type MeetingStatus = "scheduled" | "completed" | "missed";

export interface CalendarMeeting {
  id: string;
  advisorId: string;
  clientId: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: MeetingType;
  status: MeetingStatus;
  urgencyFlagId: string | null;
}

export type ChatSender = "advisor" | "client" | "system";

export interface ChatMessage {
  id: string;
  clientId: string;
  sender: ChatSender;
  timestamp: number;
  body: string;
  noteFlag: boolean;
  tags: string[];
}

export interface UrgencyFlag {
  id: string;
  clientId: string;
  source: FlagSource;
  severity: Severity;
  reason: string;
  triggerSnippet?: string;
  createdAt: number;
  resolved: boolean;
  resolvedAt?: number;
  resolutionNotes?: string;
}

export type AuditEventType =
  | "advice_given"
  | "risk_profile_updated"
  | "complaint_logged"
  | "cpd_completed"
  | "urgency_resolved";

export interface AuditEvent {
  id: string;
  source: FlagSource | "cpd" | "profile";
  clientId: string | null;
  advisorId: string;
  eventType: AuditEventType;
  timestamp: number;
  evidenceRef: string;
  status: "compliant" | "missing_field" | "flagged_for_review";
}

export interface Reminder {
  id: string;
  meetingId: string;
  advisorId: string;
  clientId: string;
  message: string;
  leadTime: string;
  createdAt: number;
  done: boolean;
}
