import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { CertificateForm } from "@/features/admin/certificate-form"
import { createCertificate } from "../../actions"

export const metadata: Metadata = {
  title: "Add Certificate — Admin",
  robots: { index: false, follow: false },
}

export default async function NewCertificatePage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createCertificate({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Certificate" description="Add a new professional certification or credential" />
      <CertificateForm onSubmit={handleCreate} />
    </div>
  )
}
