import type { Metadata } from "next"
import { Plus, Pencil } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { deleteAchievement } from "../actions"

export const metadata: Metadata = {
  title: "Achievements — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminAchievementsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("achievements")
    .select("*")
    .order("award_date", { ascending: false })

  return (
    <div>
      <AdminPageHeader title="Achievements" description={`${items?.length ?? 0} total`}>
        <a
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus size={16} />
          Add Achievement
        </a>
      </AdminPageHeader>
      <div className="space-y-3">
        {!items?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No achievements yet.
          </div>
        )}
        {items?.map((item) => (
          <div
            key={item.id}
            className="glass flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-lg">
              ⭐
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-white/60">{item.organization || item.category}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`/admin/achievements/${item.id}/edit`}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={item.id} action={deleteAchievement} label="achievement" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
