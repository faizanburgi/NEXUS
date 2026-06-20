import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { GLSLHills } from "@/components/ui/glsl-hills";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-12">
      {/* Full-screen animated backdrop (z-0) sits above the root liquid-bg and
          below the form (z-10). Kept at z-0 — not negative — so it is never
          painted behind an ancestor's opaque background. */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        <GLSLHills width="100vw" height="100vh" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-slate-950/30 via-slate-950/10 to-slate-950/75" />
      </div>

      <Suspense
        fallback={
          <div className="relative z-10 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
