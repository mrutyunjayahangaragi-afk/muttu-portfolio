import type { Metadata } from "next"
import { Plus, Pencil } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { deleteLeadership } from "../actions"

export const metadata: Metadata = {
  title: "Leadership — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminLeadershipPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("leadership")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div>
      <AdminPageHeader title="Leadership" description={`${items?.length ?? 0} roles`}>
        <a
          href="/admin/leadership/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus size={16} />
          Add Leadership Role
        </a>
      </AdminPageHeader>
      <div className="space-y-3">
        {!items?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No leadership roles yet.
          </div>
        )}
        {items?.map((item) => (
          <div
            key={item.id}
            className="glass flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-lg">
              👥
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-white/60">{item.organization}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`/admin/leadership/${item.id}/edit`}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={item.id} action={deleteLeadership} label="leadership role" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
