"use client"

import { Download, FileText, Printer, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DashboardAnalyticsData } from "@/services/analytics"

interface AnalyticsExportReportsProps {
  data: DashboardAnalyticsData
}

export function AnalyticsExportReports({ data }: AnalyticsExportReportsProps) {
  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Total Projects", data.portfolioStats.totalProjects],
      ["Published Projects", data.portfolioStats.publishedProjects],
      ["Draft Projects", data.portfolioStats.draftProjects],
      ["Total Skills", data.portfolioStats.totalSkills],
      ["Skill Categories", data.portfolioStats.skillCategoriesCount],
      ["Experience Items", data.portfolioStats.totalExperience],
      ["Education Items", data.portfolioStats.totalEducation],
      ["Certificates", data.portfolioStats.totalCertificates],
      ["Achievements", data.portfolioStats.totalAchievements],
      ["Hackathons", data.portfolioStats.totalHackathons],
      ["Total Blogs", data.portfolioStats.totalBlogs],
      ["Published Blogs", data.portfolioStats.publishedBlogs],
      ["Blog Views", data.portfolioStats.totalBlogViews],
      ["Gallery Images", data.portfolioStats.totalGalleryImages],
      ["Gallery Videos", data.portfolioStats.totalGalleryVideos],
      ["Contact Messages", data.portfolioStats.totalContactMessages],
      ["Unread Messages", data.portfolioStats.unreadContactMessages],
      ["Resume Downloads", data.portfolioStats.resumeDownloads],
      ["AI Conversations", data.aiAssistantStats.totalConversations],
      ["AI Messages", data.aiAssistantStats.totalMessages],
      ["Total Visitors", data.trafficStats.totalVisitors],
      ["Monthly Visitors", data.trafficStats.monthlyVisitors],
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Portfolio_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function exportJSON() {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
    const link = document.createElement("a")
    link.setAttribute("href", jsonStr)
    link.setAttribute("download", `Portfolio_Analytics_Dump_${new Date().toISOString().split("T")[0]}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function printPDF() {
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={exportCSV}
        size="sm"
        variant="outline"
        className="border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs gap-1.5"
      >
        <FileSpreadsheet size={14} className="text-emerald-400" />
        Export CSV
      </Button>

      <Button
        onClick={exportJSON}
        size="sm"
        variant="outline"
        className="border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs gap-1.5"
      >
        <Download size={14} className="text-cyan-400" />
        Export JSON
      </Button>

      <Button
        onClick={printPDF}
        size="sm"
        className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shadow-lg shadow-blue-500/20"
      >
        <Printer size={14} />
        Print PDF Report
      </Button>
    </div>
  )
}
