import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { SkillForm } from "@/features/admin/skill-form"
import { createSkillAction } from "../skill-actions"

export const metadata: Metadata = {
  title: "New Skill — Admin",
  robots: { index: false, follow: false },
}

export default async function NewSkillPage() {
  await requireAdmin()
  return (
    <div>
      <AdminPageHeader
        title="Add New Skill"
        description="Create a new skill to display in your portfolio."
      />
      <SkillForm onSubmit={createSkillAction} />
    </div>
  )
}
