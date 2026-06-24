import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (this Next.js 16 fork's name for Middleware). Optimistic auth gate for
 * the /tools/* namespace: reads ONLY the Supabase auth cookie (no DB call, per
 * the fork's authentication guide) and redirects unauthenticated users to
 * /sign-in. Real enforcement lives in the DAL (lib/shared/auth/dal.ts), called
 * per page and Route Handler. Skips entirely in placeholder mode.
 */
export function proxy(request: NextRequest) {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseConfigured) return NextResponse.next();

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  if (!hasAuthCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/tools/:path*"],
};
