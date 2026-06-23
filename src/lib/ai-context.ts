import type { Role } from "@/types";
import { NexusStore } from "@/services/NexusStore";

type Store = typeof NexusStore;

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiContextPayload {
  role: Role;
  userId: string;
  userName: string;
  context: Record<string, unknown>;
}

export function buildAiContext(
  store: Store,
  role: Role,
  userId: string,
  userName: string
): AiContextPayload {
  if (role === "ADVISOR") {
    return {
      role,
      userId,
      userName,
      context: buildAdvisorContext(store),
    };
  }
  return {
    role,
    userId,
    userName,
    context: buildClientContext(store, userId),
  };
}

function buildAdvisorContext(store: Store): Record<string, unknown> {
  const advisor = store.getAdvisor();
  const clients = store.getClients();
  const meetings = store.getMeetings();
  const flags = store.getActiveFlags();
  const reminders = store.getActiveReminders();
  const partners = store.getPartners();
  const audit = store.getAuditReadiness();
  const courses = store.getCourses();

  return {
    advisor: {
      name: advisor.name,
      license: advisor.license,
      specializations: advisor.specializations,
      cpdCompleted: advisor.cpdCompleted,
      cpdRequired: advisor.cpdRequired,
      availability: advisor.availability,
      languages: advisor.languages,
      yearsExperience: advisor.yearsExperience,
    },
    clients: clients.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      portfolioValue: c.portfolioValue,
      portfolioChangePct: c.portfolioChangePct,
      riskTolerance: c.riskTolerance,
      goals: c.goals,
      complexityTags: c.complexityTags,
      lastContact: c.lastContact,
      hasActiveUrgency: store.hasActiveFlag(c.id),
    })),
    meetings: meetings.map((m) => ({
      id: m.id,
      clientName: store.clientName(m.clientId),
      clientId: m.clientId,
      date: m.date,
      time: m.time,
      type: m.type,
      status: m.status,
      durationMinutes: m.durationMinutes,
      urgent: m.urgencyFlagId || store.hasActiveFlag(m.clientId),
    })),
    urgencyFlags: flags.map((f) => ({
      clientName: store.clientName(f.clientId),
      clientId: f.clientId,
      severity: f.severity,
      source: f.source,
      reason: f.reason,
      triggerSnippet: f.triggerSnippet,
    })),
    reminders: reminders.map((r) => ({
      message: r.message,
      clientName: store.clientName(r.clientId),
      leadTime: r.leadTime,
    })),
    partners: partners.map((p) => ({
      name: p.name,
      type: p.type,
      satisfactionScore: p.satisfactionScore,
      relationshipStrength: p.relationshipStrength,
      sharedClients: p.sharedClientIds.map((id) => store.clientName(id)),
    })),
    cpdCourses: courses.map((c) => ({
      title: c.title,
      hours: c.cpdHours,
      tag: c.complexityTag,
      status: c.status,
    })),
    auditReadiness: audit,
  };
}

function buildClientContext(store: Store, clientId: string): Record<string, unknown> {
  const client = store.getClient(clientId);
  const advisor = store.getAdvisor();
  const meetings = store.getClientMeetings(clientId);
  const flags = store.getClientFlags(clientId);
  const messages = store.getMessages(clientId).slice(-8);
  const partners = store
    .getPartners()
    .filter((p) => client?.partnerIds.includes(p.id) || p.sharedClientIds.includes(clientId));

  return {
    client: client
      ? {
          name: client.name,
          status: client.status,
          portfolioValue: client.portfolioValue,
          portfolioChangePct: client.portfolioChangePct,
          riskTolerance: client.riskTolerance,
          goals: client.goals,
          complexityTags: client.complexityTags,
          lastContact: client.lastContact,
          riskProfileUpdated: client.riskProfileUpdated,
        }
      : null,
    advisor: {
      name: advisor.name,
      license: advisor.license,
      specializations: advisor.specializations,
      cpdCompleted: advisor.cpdCompleted,
      cpdRequired: advisor.cpdRequired,
      availability: advisor.availability,
      languages: advisor.languages,
    },
    meetings: meetings.map((m) => ({
      date: m.date,
      time: m.time,
      type: m.type,
      status: m.status,
      durationMinutes: m.durationMinutes,
    })),
    recentUpdates: flags.map((f) => ({
      reason: f.reason,
      severity: f.severity,
      resolved: f.resolved,
      triggerSnippet: f.triggerSnippet,
    })),
    recentChat: messages.map((m) => ({
      sender: m.sender,
      body: m.body,
      timestamp: m.timestamp,
    })),
    partners: partners.map((p) => ({
      name: p.name,
      type: p.type,
      satisfactionScore: p.satisfactionScore,
    })),
    services: [
      "Financial Planning",
      "Retirement Planning",
      "Estate Planning",
      "Tax Advisory",
    ],
  };
}

export const ADVISOR_SUGGESTIONS = [
  "What meetings do I have today?",
  "Which clients need urgent attention?",
  "Summarize my CPD and compliance status.",
];

export const CLIENT_SUGGESTIONS = [
  "When is my next meeting?",
  "Tell me about my assigned advisor.",
  "What partners are connected to my account?",
];
