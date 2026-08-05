/**
 * app/admin/(protected)/layout.tsx
 *
 * Layout for every authenticated admin sub-route:
 *   /admin/dashboard, /admin/projects, /admin/blog, etc.
 *
 * Security layers:
 *  1. proxy.ts → unauthenticated requests redirect to /admin before this runs
 *  2. getAdminSession() here → double-check on the server for belt-and-suspenders
 *
 * Renders: sidebar + header + main content area.
 * Root layout detects /admin prefix and suppresses public Navbar/Footer/Lenis.
 */
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { AdminSidebar } from "@/features/admin/admin-sidebar"
import { AdminHeader } from "@/features/admin/admin-header"

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect("/admin")

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[#050810] text-white antialiased">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader email={session.email} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
