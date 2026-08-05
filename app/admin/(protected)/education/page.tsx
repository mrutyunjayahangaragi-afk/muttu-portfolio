import type { Metadata } from "next"
import { Plus, Pencil } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { deleteEducation } from "../actions"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Education — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminEducationPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false })

  return (
    <div>
      <AdminPageHeader title="Education" description={`${items?.length ?? 0} items`}>
        <a
          href="/admin/education/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus size={16} />
          Add Education
        </a>
      </AdminPageHeader>
      <div className="space-y-3">
        {!items?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No education items yet.
          </div>
        )}
        {items?.map((item) => (
          <div
            key={item.id}
            className="glass flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-white/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 font-bold text-green-400">
              {item.institution[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {item.degree} in {item.field_of_study}
              </p>
              <p className="text-xs text-white/60">{item.institution}</p>
              <p className="mt-0.5 text-xs text-white/40">
                {formatDate(item.start_date, { month: "short", year: "numeric" })} –{" "}
                {item.current
                  ? "Present"
                  : item.end_date
                    ? formatDate(item.end_date, { month: "short", year: "numeric" })
                    : "–"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`/admin/education/${item.id}/edit`}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={item.id} action={deleteEducation} label="education" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
