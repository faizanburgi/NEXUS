"use client";

import { useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageSquarePlus, Send, Sparkles, X } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useStore } from "@/lib/useStore";
import {
  ADVISOR_SUGGESTIONS,
  CLIENT_SUGGESTIONS,
  buildAiContext,
  type AiChatMessage,
} from "@/lib/ai-context";
import { Button } from "@/components/ui/Button";

export function AiAssistant() {
  const { user } = useAuth();
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Nexus AI. Ask me about your meetings, clients, advisor, partners, CPD, or compliance. I use your live dashboard data.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = user?.role === "ADVISOR" ? ADVISOR_SUGGESTIONS : CLIENT_SUGGESTIONS;

  const contextPayload = useMemo(() => {
    if (!user) return null;
    return buildAiContext(store, user.role, user.id, user.name);
  }, [store, user]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending || !user || !contextPayload) return;

    setError(null);
    setPending(true);
    setInput("");

    const userMessage: AiChatMessage = { role: "user", content: trimmed };
    const history = messages.filter((m) => m.role === "user" || m.role === "assistant");
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: history.slice(-8),
          contextPayload,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string; detail?: string };

      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "No response generated." },
      ]);
      scrollToBottom();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the AI service. Please try again in a moment.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. What would you like to know about your Nexus data?",
      },
    ]);
    setError(null);
  };

  if (!user) return null;

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Open Nexus AI assistant"
        >
          <Sparkles className="h-4 w-4" />
          Nexus AI
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed bottom-6 right-6 z-50 flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
          role="dialog"
          aria-label="Nexus AI assistant"
        >
          <header className="flex items-center justify-between border-b border-border bg-black px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Bot className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">Nexus AI</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  {user.role} assistant · live context
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Clear chat"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex max-h-[340px] flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-white"
                      : "bg-foreground/5 text-foreground ring-1 ring-border"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {pending ? (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            ) : null}
          </div>

          {messages.length <= 2 ? (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={pending}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="px-4 pb-2 text-xs text-red-300">{error}</p>
          ) : null}

          <form
            className="flex items-end gap-2 border-t border-border bg-background/40 px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask about meetings, clients, CPD…"
              disabled={pending}
              className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            />
            <Button type="submit" size="sm" disabled={pending || !input.trim()}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      ) : null}
    </>
  );
}
