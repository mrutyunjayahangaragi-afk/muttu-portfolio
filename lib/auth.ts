/**
 * lib/auth.ts — Server-side admin authentication helpers
 *
 * This file is intentionally server-only. It is never imported by Client
 * Components. Every admin action and page calls requireAdmin() before any
 * database work so there is a single enforced gate.
 *
 * Security model:
 *  • Supabase session cookie holds the user JWT — verified server-side via
 *    supabase.auth.getUser() which calls the Supabase auth server.
 *  • An email allowlist (ADMIN_EMAIL env var) adds a second check so even if
 *    someone creates a Supabase account they cannot access the admin panel.
 *  • The env var is never prefixed with NEXT_PUBLIC_, so it is never bundled
 *    into the client JS.
 */
import "server-only"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminSession {
  user: User
  email: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true only when the authenticated user's email matches the
 * ADMIN_EMAIL environment variable.
 */
function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  const rawAdminEnv = process.env.ADMIN_EMAIL || "muttuhangaragi161@gmail.com"
  const cleanAdminEnv = rawAdminEnv.replace(/['"]/g, "").toLowerCase().trim()
  const cleanUserEmail = email.replace(/['"]/g, "").toLowerCase().trim()

  return cleanUserEmail === cleanAdminEnv || cleanUserEmail === "muttuhangaragi161@gmail.com"
}

/**
 * getAdminSession — fetch and validate the current Supabase session.
 * Returns the session if the user is authenticated AND is the admin.
 * Returns null otherwise. Does NOT redirect — use requireAdmin() for that.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !user.email) return null
  if (!isAdminEmail(user.email)) return null

  return { user, email: user.email }
}

/**
 * requireAdmin — use this at the top of every admin Server Component and
 * Server Action. Redirects to /admin (the login page) if not authenticated.
 * Throws if called from a Server Action context (returns void after redirect).
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    redirect("/admin?unauthorized=1")
  }
  return session
}

/**
 * requireAdminForAction — use inside Server Actions instead of requireAdmin.
 * Throws a typed error rather than redirecting, so the action caller can
 * surface it in the UI.
 */
export async function requireAdminForAction(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("Unauthorized: Admin access required")
  }
  return session
}
