"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  ArrowLeft,
  Tag,
} from "lucide-react"
import type { Certificate } from "@/types"

interface CertificateDetailProps {
  certificate: Certificate
  related: Certificate[]
}

export function CertificateDetail({ certificate: cert, related }: CertificateDetailProps) {
  return (
    <div className="px-4">
      {/* Back nav */}
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 pt-8"
        >
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Certificates
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Certificate Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cert.image_url ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <Award size={64} className="text-emerald-400/40" />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Featured badge */}
            {cert.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400 ring-1 ring-yellow-500/20">
                ⭐ Featured Certificate
              </span>
            )}

            <h1 className="text-3xl font-bold text-white">{cert.title}</h1>
            <p className="text-xl text-white/60">{cert.issuer}</p>

            {/* Credential Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={15} className="shrink-0 text-white/30" />
                <div>
                  <p className="text-xs text-white/40">Issued</p>
                  <p className="text-sm text-white">
                    {new Date(cert.issue_date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {cert.expiry_date && (
                <div className="flex items-center gap-3">
                  <Calendar size={15} className="shrink-0 text-white/30" />
                  <div>
                    <p className="text-xs text-white/40">Expires</p>
                    <p className="text-sm text-white">
                      {new Date(cert.expiry_date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {cert.credential_id && (
                <div className="flex items-center gap-3">
                  <Tag size={15} className="shrink-0 text-white/30" />
                  <div>
                    <p className="text-xs text-white/40">Credential ID</p>
                    <p className="font-mono text-sm text-white">{cert.credential_id}</p>
                  </div>
                </div>
              )}
              {cert.category && (
                <div className="flex items-center gap-3">
                  <Award size={15} className="shrink-0 text-white/30" />
                  <div>
                    <p className="text-xs text-white/40">Category</p>
                    <p className="text-sm capitalize text-white">{cert.category}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            {cert.skills && cert.skills.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                  Skills Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400/80 ring-1 ring-emerald-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  <CheckCircle2 size={15} />
                  Verify Credential
                </a>
              )}
              {cert.pdf_url && (
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  <Download size={15} />
                  Download PDF
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Certificates */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-6 text-xl font-semibold text-white">Related Certificates</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.slug ? `/certificates/${rel.slug}` : "/certificates"}
                  className="glass glass-hover group flex items-center gap-3 rounded-2xl border border-white/10 p-4 transition-all duration-300 hover:border-emerald-500/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/10">
                    {rel.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rel.image_url}
                        alt={rel.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Award size={16} className="text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white group-hover:text-emerald-400">
                      {rel.title}
                    </p>
                    <p className="text-xs text-white/40">{rel.issuer}</p>
                  </div>
                  <ExternalLink size={13} className="ml-auto shrink-0 text-white/20 group-hover:text-white/50" />
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
