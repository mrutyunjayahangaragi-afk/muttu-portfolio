"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MapPin, FileText, CheckCircle2, AlertCircle, Phone, Briefcase } from "lucide-react"
import { submitContactMessage } from "@/app/contact/actions"
import { HireMeModal } from "@/components/modals/hire-me-modal"
import type { Settings, SocialLink, Resume } from "@/types"
import type { ActionResult } from "@/types/actions"

const initialState: ActionResult = {
  success: false,
  error: "",
}

interface ContactClientProps {
  settings: Settings | null
  socialLinks: SocialLink[]
  latestResume: Resume | null
}

export function ContactClient({ settings, socialLinks, latestResume }: ContactClientProps) {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [isHireMeOpen, setIsHireMeOpen] = useState(false)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <div className="min-h-screen pt-32 pb-24 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Mail size={32} />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Let&apos;s <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            Have a project in mind, a question, or want to discuss a full-stack engineering role? I&apos;d love to hear from you.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setIsHireMeOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
            >
              <Briefcase size={18} />
              Open Hire Me Modal
            </button>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="glass rounded-3xl border border-white/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Contact Information</h2>
              <div className="space-y-6">
                {settings?.contact_email && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/50">Email</h3>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-lg font-medium text-white transition-colors hover:text-emerald-400"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.contact_phone && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/50">Phone</h3>
                      <p className="text-lg font-medium text-white">
                        {settings.contact_phone}
                      </p>
                    </div>
                  </div>
                )}

                {settings?.contact_location && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/50">Location</h3>
                      <p className="text-lg font-medium text-white">
                        {settings.contact_location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl border border-white/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Social Profiles</h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-emerald-400"
                  >
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>

            {latestResume && (
              <div className="glass rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">My Resume</h2>
                    <p className="text-sm text-white/50">Download the latest version</p>
                  </div>
                  <a
                    href={latestResume.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-black transition-transform hover:scale-110"
                  >
                    <FileText size={24} />
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-3xl border border-white/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Send a Message</h2>
              
              <form ref={formRef} action={formAction} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white/70">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/70">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-white/70">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-white/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {state.error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
                    <AlertCircle size={16} />
                    {state.error}
                  </div>
                )}

                {state.success && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400">
                    <CheckCircle2 size={16} />
                    Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Message"}
                  <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hire Me Glassmorphism Modal */}
      <HireMeModal isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} />
    </div>
  )
}
