"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PortalLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/useStore";
import { DEMO_CLIENT_ID } from "@/services/NexusStore";

export default function ClientChatPage() {
  const store = useStore();
  const advisor = store.getAdvisor();
  const messages = store.getMessages(DEMO_CLIENT_ID);
  const [draft, setDraft] = useState("");

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    store.sendMessage(DEMO_CLIENT_ID, body, "client");
    setDraft("");
  };

  return (
    <>
      <PageHeader
        title="Secure Chat"
        subtitle="A direct, encrypted line to your advisory team."
      />

      <Card className="flex flex-col">
        <CardHeader
          title={advisor.name}
          description="Enterprise Advisor · usually replies within the hour"
          icon={
            <Image
              src={advisor.photo}
              alt={advisor.name}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 rounded-lg object-cover"
            />
          }
          action={<Badge tone="green">Online</Badge>}
        />
        <CardBody className="flex min-h-[380px] flex-1 flex-col gap-2.5">
          {messages.length === 0 ? (
            <p className="my-auto text-center text-sm text-muted">
              Start the conversation — your advisor sees it instantly.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.sender === "client"
                    ? "ml-auto bg-foreground text-primary-foreground"
                    : m.sender === "system"
                    ? "mx-auto bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30"
                    : "mr-auto bg-foreground/5 text-foreground"
                }`}
              >
                {m.sender === "advisor" ? (
                  <span className="mb-0.5 block text-[11px] font-semibold text-muted">
                    {advisor.name}
                  </span>
                ) : null}
                {m.body}
                {m.tags.includes("follow-up needed") ? (
                  <span className="mt-1 block">
                    <Badge tone="red">flagged to advisor</Badge>
                  </span>
                ) : null}
              </div>
            ))
          )}
        </CardBody>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Message your advisor…"
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
            <Button onClick={send}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck className="h-3 w-3" />
            Messages flagged as urgent appear in your advisor&apos;s priority feed automatically.
          </p>
        </div>
      </Card>
    </>
  );
}
