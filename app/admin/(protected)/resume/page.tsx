import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ResumeUploader } from "@/features/admin/resume-uploader"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Resume — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminResumePage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .order("created_at", { ascending: false })

  const active = resumes?.find((r) => r.active)

  return (
    <div>
      <AdminPageHeader title="Resume Manager" description="Upload and manage your resume PDF." />

      {/* Upload form */}
      <div className="glass mb-6 rounded-2xl border border-white/10 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Upload New Resume</h2>
        <ResumeUploader />
      </div>

      {/* Active resume */}
      {active && (
        <div className="glass mb-4 rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{active.file_name}</p>
              <p className="mt-0.5 text-xs text-white/50">
                Version {active.version} · Uploaded{" "}
                {formatDate(active.created_at, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <a
              href={active.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-500/20 px-3 py-1.5 text-xs text-green-400 transition-colors hover:bg-green-500/30"
            >
              View PDF ↗
            </a>
          </div>
        </div>
      )}

      {/* History */}
      {resumes && resumes.length > 1 && (
        <div className="glass overflow-hidden rounded-2xl border border-white/10">
          <div className="border-b border-white/10 px-5 py-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase">
              History
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {resumes
              .filter((r) => !r.active)
              .map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-white/70">{r.file_name}</p>
                    <p className="text-xs text-white/40">
                      {formatDate(r.created_at, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <a
                    href={r.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/40 hover:text-white/70"
                  >
                    View ↗
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
