"use client";

import { useState } from "react";
import { FileText, Send, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";

export default function AdvisorChatPage() {
  const store = useStore();
  const clients = store.getClients();
  const [activeClientId, setActiveClientId] = useState(clients[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [asClient, setAsClient] = useState(false);

  const messages = store.getMessages(activeClientId);

  const send = (asNote = false) => {
    const body = draft.trim();
    if (!body) return;
    store.sendMessage(activeClientId, body, asClient ? "client" : "advisor", asNote && !asClient);
    setDraft("");
  };

  return (
    <>
      <PageHeader
        title="Chat Box"
        subtitle="Messages with trigger words auto-create urgency flags; notes become audit evidence."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit">
          <CardHeader title="Conversations" />
          <CardBody className="space-y-1">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveClientId(c.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeClientId === c.id
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate font-medium">{c.name}</span>
                {store.hasActiveFlag(c.id) ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                ) : null}
              </button>
            ))}
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title={store.clientName(activeClientId)} description="Conversation thread" />
          <CardBody className="flex min-h-[340px] flex-1 flex-col gap-2.5">
            {messages.length === 0 ? (
              <p className="my-auto text-center text-sm text-muted">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.sender === "advisor"
                      ? "ml-auto bg-foreground text-primary-foreground"
                      : m.sender === "system"
                      ? "mx-auto bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30"
                      : "mr-auto bg-foreground/5 text-foreground"
                  }`}
                >
                  {m.noteFlag ? (
                    <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide opacity-80">
                      <FileText className="h-3 w-3" /> Note
                    </span>
                  ) : null}
                  {m.body}
                  {m.tags.includes("follow-up needed") ? (
                    <span className="mt-1 block">
                      <Badge tone="red">flagged</Badge>
                    </span>
                  ) : null}
                </div>
              ))
            )}
          </CardBody>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => setAsClient((v) => !v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  asClient
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-foreground/5 text-muted hover:text-foreground"
                }`}
              >
                Sending as: {asClient ? "Client" : "Advisor"}
              </button>
              <span className="text-xs text-muted">
                Tip: as client, try “I&apos;m worried, I want to withdraw everything ASAP”.
              </span>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(false);
                  }
                }}
                rows={1}
                placeholder="Type a message…"
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
              />
              {!asClient ? (
                <Button size="md" variant="secondary" onClick={() => send(true)}>
                  <FileText className="h-4 w-4" />
                  Note
                </Button>
              ) : null}
              <Button size="md" onClick={() => send(false)}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
