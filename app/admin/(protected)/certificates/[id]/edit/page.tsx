import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { CertificateForm } from "@/features/admin/certificate-form"
import { updateCertificate } from "../../../actions"
import type { Certificate } from "@/types"

export const metadata: Metadata = {
  title: "Edit Certificate — Admin",
  robots: { index: false, follow: false },
}

interface EditCertificatePageProps {
  params: Promise<{ id: string }>
}

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateCertificate(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.title}`} description={item.issuer} />
      <CertificateForm certificate={item as Certificate} onSubmit={handleUpdate} />
    </div>
  )
}
