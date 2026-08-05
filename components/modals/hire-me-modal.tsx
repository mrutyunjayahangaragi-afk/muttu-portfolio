"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Paperclip, CheckCircle2, AlertCircle, Loader2, Sparkles, Building, Globe, Phone, Mail, User } from "lucide-react"
import { submitContactFormAction } from "@/features/contact/contact-actions"

interface HireMeModalProps {
  isOpen: boolean
  onClose: () => void
}

const PROJECT_TYPES = [
  "Full-Stack Web App",
  "Mobile App Development",
  "AI & ML Integration",
  "SaaS Platform Architecture",
  "UI/UX Design & Frontend",
  "API & Backend Engineering",
  "Consulting & Code Audit",
  "Other Inquiry",
]

const BUDGET_RANGES = [
  "Less than $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
]

const TIMELINE_OPTIONS = [
  "Immediate (ASAP)",
  "1 - 2 Weeks",
  "1 Month",
  "2 - 3 Months",
  "Flexible",
]

export function HireMeModal({ isOpen, onClose }: HireMeModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Attachment size must be 10MB or smaller.")
        setFileName(null)
        return
      }
      setFileName(file.name)
      setErrorMsg(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const res = await submitContactFormAction(formData)
    setLoading(false)

    if (res.success) {
      setSubmitted(true)
    } else {
      setErrorMsg(res.error || "Failed to submit message. Please try again.")
    }
  }

  const handleResetAndClose = () => {
    setSubmitted(false)
    setErrorMsg(null)
    setFileName(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#060a12]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 my-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>

          {submitted ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 size={44} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">Thank You!</h3>
                <p className="text-base text-white/60 max-w-md mx-auto leading-relaxed">
                  Your message has been received successfully. I will review your project details and get back to you as soon as possible.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">
                  <Sparkles size={14} />
                  Start a Project
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Hire Me / <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Get in Touch</span>
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Fill out the form below to discuss your project, timelines, and budget.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                      <User size={13} /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                      <Mail size={13} /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                      <Phone size={13} /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                      <Building size={13} /> Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Acme Corp"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                {/* Country & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                      <Globe size={13} /> Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="United States"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="Project Inquiry / Hiring"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                {/* Project Type, Budget, Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">Project Type</label>
                    <select
                      name="project_type"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50"
                    >
                      <option value="" className="bg-[#060a12]">Select Type</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#060a12]">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">Estimated Budget</label>
                    <select
                      name="budget"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50"
                    >
                      <option value="" className="bg-[#060a12]">Select Budget</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b} className="bg-[#060a12]">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">Timeline</label>
                    <select
                      name="timeline"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50"
                    >
                      <option value="" className="bg-[#060a12]">Select Timeline</option>
                      {TIMELINE_OPTIONS.map((tm) => (
                        <option key={tm} value={tm} className="bg-[#060a12]">{tm}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70">Project Details &amp; Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell me about your goals, features, target audience, and expectations..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* File Attachment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/70">Attachment (Optional: PDF, DOCX, Image up to 10MB)</label>
                  <div className="relative">
                    <input
                      type="file"
                      name="attachment"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-2.5 text-xs text-white/60">
                      <Paperclip size={16} className="text-blue-400" />
                      <span className="truncate">{fileName || "Choose file or drag & drop..."}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
