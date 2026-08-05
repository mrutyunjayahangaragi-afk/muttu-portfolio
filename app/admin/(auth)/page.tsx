/**
 * app/admin/page.tsx
 *
 * The admin entry point. This single route handles two states:
 *
 *  1. Unauthenticated / wrong credentials → shows the owner-only login form
 *  2. Already authenticated as admin → redirects to /admin/dashboard
 *
 * The page is not linked from anywhere on the public site. Visitors who
 * somehow navigate here see a minimal login UI with no signup / reset links.
 */
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Shield } from "lucide-react"
import { getAdminSession } from "@/lib/auth"
import { AdminLoginForm } from "@/features/auth/admin-login-form"

export const metadata: Metadata = {
  title: "Admin",
  // Never index the admin page
  robots: { index: false, follow: false, noarchive: true },
}

interface AdminPageProps {
  searchParams: Promise<{ unauthorized?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await getAdminSession()
  const params = await searchParams

  // Already authenticated admin → go straight to dashboard
  if (session) {
    redirect("/admin/dashboard")
  }

  const isUnauthorized = params.unauthorized === "1"

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020408] px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(ellipse, #3b82f6 0%, #a855f7 60%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/25">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-sm text-white/50">Restricted to authorised personnel only.</p>
        </div>

        {/* Unauthorized notice */}
        {isUnauthorized && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400"
          >
            You do not have permission to access this area.
          </div>
        )}

        {/* Login form — email/password only */}
        <AdminLoginForm />

        {/* Security note — no links to register/reset */}
        <p className="text-center text-xs text-white/20">This page is not publicly accessible.</p>
      </div>
    </div>
  )
}
