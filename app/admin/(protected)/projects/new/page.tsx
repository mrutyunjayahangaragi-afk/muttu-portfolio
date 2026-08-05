import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ProjectForm } from "@/features/admin/project-form"
import { createProjectAction } from "../project-actions"

export const metadata: Metadata = {
  title: "New Project — Admin",
  robots: { index: false, follow: false },
}

export default async function NewProjectPage() {
  await requireAdmin()
  return (
    <div>
      <AdminPageHeader title="Add New Project" description="Create a new project to showcase in your portfolio." />
      <ProjectForm onSubmit={createProjectAction} />
    </div>
  )
}
