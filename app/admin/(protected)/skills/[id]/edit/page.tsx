import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { SkillForm } from "@/features/admin/skill-form"
import { updateSkillAction } from "../../skill-actions"
import type { Skill } from "@/types"

export const metadata: Metadata = {
  title: "Edit Skill — Admin",
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: skill } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single()

  if (!skill) notFound()

  // Bind id into the action
  const boundAction = updateSkillAction.bind(null, id)

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${skill.name}`}
        description="Update skill details, proficiency, and visibility."
      />
      <SkillForm skill={skill as Skill} onSubmit={boundAction} />
    </div>
  )
}
