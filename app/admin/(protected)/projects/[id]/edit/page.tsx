import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ProjectForm } from "@/features/admin/project-form"
import { updateProjectAction } from "../../project-actions"
import type { Project } from "@/types"

export const metadata: Metadata = {
  title: "Edit Project — Admin",
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("*").eq("id", id).single()
  if (!data) notFound()

  const boundAction = updateProjectAction.bind(null, id)

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${data.title}`}
        description="Update project details, media, and visibility."
      />
      <ProjectForm project={data as Project} onSubmit={boundAction} />
    </div>
  )
}
