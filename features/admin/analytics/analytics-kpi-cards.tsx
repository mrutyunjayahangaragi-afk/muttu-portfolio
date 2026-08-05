"use client"

import { motion } from "framer-motion"
import {
  FolderKanban,
  Wrench,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  BookOpen,
  ImageIcon,
  MessageSquare,
  FileText,
  Bot,
  Users,
  Eye,
  ShieldCheck,
  Star,
  CheckCircle,
  FileCheck,
} from "lucide-react"
import type { DashboardAnalyticsData } from "@/services/analytics"

interface AnalyticsKpiCardsProps {
  portfolioStats: DashboardAnalyticsData["portfolioStats"]
  aiStats: DashboardAnalyticsData["aiAssistantStats"]
  trafficStats: DashboardAnalyticsData["trafficStats"]
  adminStats: DashboardAnalyticsData["adminSystemStats"]
}

export function AnalyticsKpiCards({
  portfolioStats,
  aiStats,
  trafficStats,
  adminStats,
}: AnalyticsKpiCardsProps) {
  const cards = [
    {
      title: "Projects",
      value: portfolioStats.totalProjects,
      subtitle: `${portfolioStats.publishedProjects} Published • ${portfolioStats.draftProjects} Drafts`,
      badge: `${portfolioStats.featuredProjects} Featured`,
      icon: FolderKanban,
      color: "from-blue-600 to-cyan-600",
      accent: "text-blue-400",
    },
    {
      title: "Skills",
      value: portfolioStats.totalSkills,
      subtitle: `${portfolioStats.skillCategoriesCount} Categories`,
      badge: `${portfolioStats.featuredSkills} Featured`,
      icon: Wrench,
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-400",
    },
    {
      title: "Education & Career",
      value: portfolioStats.totalExperience + portfolioStats.totalEducation,
      subtitle: `${portfolioStats.totalExperience} Exp • ${portfolioStats.totalEducation} Edu`,
      badge: "Verified",
      icon: Briefcase,
      color: "from-indigo-600 to-blue-600",
      accent: "text-indigo-400",
    },
    {
      title: "Certificates & Badges",
      value: portfolioStats.totalCertificates,
      subtitle: `${portfolioStats.featuredCertificates} Featured Credentials`,
      badge: "Verified",
      icon: Award,
      color: "from-amber-500 to-yellow-600",
      accent: "text-amber-400",
    },
    {
      title: "Achievements & Awards",
      value: portfolioStats.totalAchievements,
      subtitle: `${portfolioStats.featuredAchievements} Highlighted`,
      badge: "Trophies",
      icon: Star,
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
    },
    {
      title: "Hackathons",
      value: portfolioStats.totalHackathons,
      subtitle: `${portfolioStats.featuredHackathons} Featured Wins`,
      badge: "Competitions",
      icon: Trophy,
      color: "from-rose-600 to-pink-600",
      accent: "text-rose-400",
    },
    {
      title: "Blogs & Articles",
      value: portfolioStats.totalBlogs,
      subtitle: `${portfolioStats.publishedBlogs} Published • ${portfolioStats.draftBlogs} Drafts`,
      badge: `${portfolioStats.totalBlogViews} Views`,
      icon: BookOpen,
      color: "from-violet-600 to-purple-600",
      accent: "text-violet-400",
    },
    {
      title: "Media Assets",
      value: portfolioStats.totalGalleryImages + portfolioStats.totalGalleryVideos,
      subtitle: `${portfolioStats.totalGalleryImages} Images • ${portfolioStats.totalGalleryVideos} Videos`,
      badge: "Cloudinary/Uploads",
      icon: ImageIcon,
      color: "from-teal-600 to-cyan-600",
      accent: "text-teal-400",
    },
    {
      title: "Contact Messages",
      value: portfolioStats.totalContactMessages,
      subtitle: `${portfolioStats.unreadContactMessages} Unread • ${portfolioStats.repliedContactMessages} Replied`,
      badge: portfolioStats.unreadContactMessages > 0 ? `${portfolioStats.unreadContactMessages} New` : "Clean Inbox",
      icon: MessageSquare,
      color: "from-orange-600 to-red-600",
      accent: "text-orange-400",
    },
    {
      title: "Resume Downloads",
      value: portfolioStats.resumeDownloads,
      subtitle: portfolioStats.activeResumeTitle ? `Active: ${portfolioStats.activeResumeTitle}` : "PDF Resume",
      badge: "Direct Views",
      icon: FileText,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
    },
    {
      title: "AI Conversations",
      value: aiStats.totalConversations,
      subtitle: `${aiStats.totalMessages} Messages • ${aiStats.questionsToday} Questions Today`,
      badge: `${aiStats.avgResponseTimeSec}s Avg Speed`,
      icon: Bot,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
    },
    {
      title: "Portfolio Traffic",
      value: trafficStats.totalVisitors,
      subtitle: `${trafficStats.todayVisitors} Today • ${trafficStats.weeklyVisitors} This Week`,
      badge: `${trafficStats.monthlyVisitors} Monthly`,
      icon: Eye,
      color: "from-cyan-600 to-blue-600",
      accent: "text-cyan-400",
    },
    {
      title: "Admin System Health",
      value: adminStats.totalAdminAccounts,
      subtitle: adminStats.totalErrorLogs > 0 ? `${adminStats.totalErrorLogs} System Logged Errors` : "All Systems Operational",
      badge: "Owner Authenticated",
      icon: ShieldCheck,
      color: "from-green-600 to-emerald-600",
      accent: "text-green-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="glass glass-hover relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:border-white/20"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Value */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white">{card.value}</span>
              {card.badge && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70">
                  {card.badge}
                </span>
              )}
            </div>

            {/* Subtitle */}
            <p className="mt-2 text-xs text-white/50 truncate">{card.subtitle}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
