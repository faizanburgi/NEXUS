import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE } from "@/services/AuthService";
import type { AiChatMessage, AiContextPayload } from "@/lib/ai-context";
import { generateAiReply } from "@/lib/ai-responder";

interface AiChatRequestBody {
  message: string;
  history?: AiChatMessage[];
  contextPayload: AiContextPayload;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: AiChatRequestBody;
  try {
    body = (await request.json()) as AiChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const payload = body.contextPayload;
  if (!payload || payload.role !== session.role || payload.userId !== session.sub) {
    return NextResponse.json({ error: "Context mismatch" }, { status: 403 });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  try {
    const reply = await generateAiReply(payload, message, history);
    return NextResponse.json({
      reply,
      mode: process.env.OPENAI_API_KEY ? "openai" : "contextual",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "AI request failed", detail }, { status: 500 });
  }
}
