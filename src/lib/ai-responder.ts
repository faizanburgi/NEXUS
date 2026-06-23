import type { AiChatMessage, AiContextPayload } from "@/lib/ai-context";

const SYSTEM_PROMPT =
  "You are Nexus AI, an intelligent assistant embedded in the Nexus advisory platform. " +
  "Answer questions about meetings, clients, advisors, partners, CPD, compliance, and engagement using ONLY the CONTEXT JSON provided. " +
  "Be concise, professional, and actionable. If the context lacks the answer, say what is missing and suggest where in Nexus to look. " +
  "Never invent client names, meeting times, or portfolio figures not present in context.";

function contextBlock(payload: AiContextPayload): string {
  return JSON.stringify(payload.context, null, 2);
}

export async function generateAiReply(
  payload: AiContextPayload,
  message: string,
  history: AiChatMessage[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      return await callOpenAi(apiKey, payload, message, history);
    } catch {
      // Fall through to local contextual responder if the provider fails.
    }
  }
  return contextualFallbackReply(payload, message);
}

async function callOpenAi(
  apiKey: string,
  payload: AiContextPayload,
  message: string,
  history: AiChatMessage[]
): Promise<string> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const system = `${SYSTEM_PROMPT}\n\nUser: ${payload.userName} (${payload.role})\n\nCONTEXT:\n${contextBlock(payload)}`;

  const messages = [
    { role: "system" as const, content: system },
    ...history.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 700,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

/** Deterministic contextual answers when no API key is configured. */
function contextualFallbackReply(payload: AiContextPayload, message: string): string {
  const q = message.toLowerCase();
  const ctx = payload.context;

  if (payload.role === "ADVISOR") {
    const meetings = (ctx.meetings as Array<Record<string, unknown>>) ?? [];
    const clients = (ctx.clients as Array<Record<string, unknown>>) ?? [];
    const flags = (ctx.urgencyFlags as Array<Record<string, unknown>>) ?? [];
    const advisor = ctx.advisor as Record<string, unknown> | undefined;
    const audit = ctx.auditReadiness as Record<string, unknown> | undefined;

    if (q.includes("meeting") || q.includes("calendar") || q.includes("agenda")) {
      if (q.includes("today")) {
        const today = meetings.filter((m) => m.date === "Today");
        if (!today.length) return "You have no meetings scheduled for today in the current Nexus data.";
        return (
          "Today's meetings:\n" +
          today
            .map(
              (m) =>
                `• ${m.time} — ${m.clientName} (${m.type}, ${m.durationMinutes} min)${m.urgent ? " [URGENT]" : ""}`
            )
            .join("\n")
        );
      }
      if (!meetings.length) return "No meetings are loaded in your Nexus calendar.";
      return (
        "Upcoming meetings:\n" +
        meetings
          .slice(0, 6)
          .map(
            (m) =>
              `• ${m.date} ${m.time} — ${m.clientName} (${m.type})`
          )
          .join("\n")
      );
    }

    if (q.includes("client") || q.includes("portfolio") || q.includes("at risk")) {
      const atRisk = clients.filter((c) => c.status === "At Risk" || c.hasActiveUrgency);
      if (q.includes("risk") || q.includes("urgent") || q.includes("attention")) {
        if (!atRisk.length) return "No clients are currently flagged as at risk or urgent.";
        return (
          "Clients needing attention:\n" +
          atRisk
            .map(
              (c) =>
                `• ${c.name} — status ${c.status}, portfolio $${Number(c.portfolioValue).toLocaleString()}, change ${c.portfolioChangePct}%`
            )
            .join("\n")
        );
      }
      return (
        `You have ${clients.length} clients on your book. Highlights:\n` +
        clients
          .slice(0, 5)
          .map(
            (c) =>
              `• ${c.name} (${c.status}) — $${Number(c.portfolioValue).toLocaleString()}, ${c.riskTolerance}`
          )
          .join("\n")
      );
    }

    if (q.includes("cpd") || q.includes("compliance") || q.includes("audit")) {
      const cpd = advisor
        ? `${advisor.cpdCompleted}/${advisor.cpdRequired} CPD hours`
        : "CPD data unavailable";
      const score = audit?.score ?? "—";
      return `CPD: ${cpd}. MAS audit readiness score: ${score}. Open Compliance in the sidebar for the full breakdown and audit log.`;
    }

    if (q.includes("partner") || q.includes("ecosystem")) {
      const partners = (ctx.partners as Array<Record<string, unknown>>) ?? [];
      if (!partners.length) return "No partner records are in context.";
      return (
        "Partner ecosystem:\n" +
        partners
          .map(
            (p) =>
              `• ${p.name} (${p.type}) — satisfaction ${p.satisfactionScore}/100`
          )
          .join("\n")
      );
    }

    if (q.includes("urgency") || q.includes("flag")) {
      if (!flags.length) return "No active urgency flags — your feed is clear.";
      return (
        "Active urgency flags:\n" +
        flags
          .map((f) => `• [${f.severity}] ${f.clientName}: ${f.reason}`)
          .join("\n")
      );
    }
  }

  if (payload.role === "CLIENT") {
    const client = ctx.client as Record<string, unknown> | null;
    const advisor = ctx.advisor as Record<string, unknown> | undefined;
    const meetings = (ctx.meetings as Array<Record<string, unknown>>) ?? [];
    const partners = (ctx.partners as Array<Record<string, unknown>>) ?? [];

    if (q.includes("advisor") || q.includes("who")) {
      if (!advisor) return "Advisor details are not available in context.";
      return (
        `Your assigned advisor is ${advisor.name} (license ${advisor.license}). ` +
        `Specializations: ${(advisor.specializations as string[]).join(", ")}. ` +
        `Availability: ${advisor.availability}. Languages: ${(advisor.languages as string[]).join(", ")}.`
      );
    }

    if (q.includes("meeting") || q.includes("schedule") || q.includes("next")) {
      if (!meetings.length) return "No meetings are scheduled yet. Book one from Meetings in the sidebar.";
      const next = meetings[0];
      return (
        `Your meetings:\n` +
        meetings
          .map((m) => `• ${m.date} at ${m.time} — ${m.type} (${m.status})`)
          .join("\n") +
        `\n\nNext up: ${next.date} at ${next.time} (${next.type}).`
      );
    }

    if (q.includes("partner")) {
      if (!partners.length) return "No ecosystem partners are linked to your account yet.";
      return (
        "Your connected partners:\n" +
        partners.map((p) => `• ${p.name} (${p.type})`).join("\n")
      );
    }

    if (q.includes("portfolio") || q.includes("goal") || q.includes("engagement")) {
      if (!client) return "Client profile data is not loaded.";
      return (
        `Portfolio: $${Number(client.portfolioValue).toLocaleString()} (${client.portfolioChangePct}% recent change). ` +
        `Risk tolerance: ${client.riskTolerance}. Goals: ${(client.goals as string[]).join("; ")}. ` +
        `Status: ${client.status}.`
      );
    }
  }

  return (
    `I'm Nexus AI (${payload.role} view). I can help with meetings, clients, advisors, partners, CPD, and compliance based on your live dashboard data. ` +
    "Try asking about today's meetings, clients at risk, or your next scheduled call."
  );
}
