"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Award, ArrowRight } from "lucide-react"
import type { Certificate } from "@/types"

interface FeaturedCertificatesSectionProps {
  certificates: Certificate[]
}

export function FeaturedCertificatesSection({ certificates }: FeaturedCertificatesSectionProps) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white">Featured Certificates</h2>
            <p className="mt-2 text-white/50">Key credentials and certifications</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/certificates"
              className="group flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={cert.slug ? `/certificates/${cert.slug}` : "/certificates"}
                className="glass glass-hover group flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-all hover:border-emerald-500/20"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  {cert.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <Award size={24} className="text-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white group-hover:text-emerald-400">
                    {cert.title}
                  </h3>
                  <p className="truncate text-xs text-white/50">{cert.issuer}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
