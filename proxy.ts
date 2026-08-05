/**
 * proxy.ts — Next.js 16 Proxy (replaces middleware.ts)
 *
 * Runs before every matched request. Responsibilities:
 *  1. Refresh Supabase session cookies (always — do not skip the getUser call)
 *  2. Enforce admin-only access on all /admin sub-routes
 *  3. Block the old /login and /register routes (redirect → /)
 *
 * Security note: the proxy performs only "optimistic" checks suitable for UX
 * redirects. Hard authorization is enforced again inside each Server Component
 * (via requireAdmin) and each Server Action (via requireAdminForAction).
 * The proxy is NOT the sole security boundary.
 */
import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimization)
     *  - favicon.ico
     *  - Common image extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
}
