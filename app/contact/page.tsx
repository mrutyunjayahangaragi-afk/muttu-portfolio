import { Metadata } from "next"
import { ContactClient } from "@/features/contact/contact-client"
import { getCachedSettings, getCachedSocialLinks, getCachedLatestResume } from "@/services/settings"

export const metadata: Metadata = {
  title: "Contact | Professional Portfolio",
  description: "Get in touch with me for opportunities, collaborations, or just to say hi.",
}

export default async function ContactPage() {
  const settings = await getCachedSettings()
  const socialLinks = await getCachedSocialLinks()
  const latestResume = await getCachedLatestResume()

  return (
    <ContactClient
      settings={settings}
      socialLinks={socialLinks}
      latestResume={latestResume}
    />
  )
}
