import type { JwtPayload, Role } from "@/types";

const SECRET = "nexus-mock-secret-key-2026";
const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function toBase64Url(input: string): string {
  let base64: string;
  if (typeof btoa === "function") {
    base64 = btoa(unescape(encodeURIComponent(input)));
  } else {
    base64 = Buffer.from(input, "utf-8").toString("base64");
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(padded)));
  }
  return Buffer.from(padded, "base64").toString("utf-8");
}

/**
 * Deterministic, dependency-free signature. This is a MOCK signing scheme for
 * the MVP only — it is not cryptographically secure and must not be used to
 * protect real secrets.
 */
function sign(data: string): string {
  let hash = 0x811c9dc5;
  const material = `${data}.${SECRET}`;
  for (let i = 0; i < material.length; i++) {
    hash ^= material.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const unsigned = hash >>> 0;
  return toBase64Url(unsigned.toString(16).padStart(8, "0"));
}

export interface IssueTokenInput {
  sub: string;
  name: string;
  email: string;
  role: Role;
}

export function issueToken(input: IssueTokenInput): string {
  const header = toBase64Url(JSON.stringify({ alg: "HS256-MOCK", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    ...input,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${encodedPayload}`);
  return `${header}.${encodedPayload}.${signature}`;
}

export function decodeToken(token: string | undefined | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(fromBase64Url(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyToken(token: string | undefined | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  if (sign(`${header}.${payload}`) !== signature) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp < now) return null;

  return decoded;
}
