import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE } from "@/services/AuthService";

/**
 * Zero-trust route protection. Runs server-side (Node.js runtime) before any
 * advisor/client route renders. The mock JWT is read from the auth cookie,
 * verified, and the embedded role is matched against the requested portal.
 *
 * In Next.js 16 the `middleware` convention was renamed to `proxy`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdvisorArea = pathname.startsWith("/advisor");
  const isClientArea = pathname.startsWith("/client");

  if (!isAdvisorArea && !isClientArea) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = verifyToken(token);

  // Unauthenticated → send to the unified login page.
  if (!session) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but wrong portal → forbidden (403).
  if (isAdvisorArea && session.role !== "ADVISOR") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  if (isClientArea && session.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/advisor/:path*", "/client/:path*"],
};
