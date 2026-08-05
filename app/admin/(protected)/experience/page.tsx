import type { Metadata } from "next"
import { Plus, Pencil, MapPin, Calendar } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { deleteExperience } from "../actions"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Experience — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminExperiencePage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("experience")
    .select("*")
    .order("start_date", { ascending: false })

  return (
    <div>
      <AdminPageHeader title="Experience" description={`${items?.length ?? 0} items`}>
        <a
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus size={16} />
          Add Experience
        </a>
      </AdminPageHeader>

      <div className="space-y-3">
        {!items?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No experience items yet.
          </div>
        )}
        {items?.map((item) => (
          <div
            key={item.id}
            className="glass flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 font-bold text-blue-400">
              {item.company[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{item.role}</p>
              <p className="text-xs text-white/60">{item.company}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(item.start_date, { month: "short", year: "numeric" })} –{" "}
                  {item.current
                    ? "Present"
                    : item.end_date
                      ? formatDate(item.end_date, { month: "short", year: "numeric" })
                      : "–"}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {item.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`/admin/experience/${item.id}/edit`}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={item.id} action={deleteExperience} label="experience" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
