import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getDashboardAnalyticsData } from "@/services/analytics"
import { createClient } from "@/lib/supabase/server"

// Components
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { AnalyticsKpiCards } from "@/features/admin/analytics/analytics-kpi-cards"
import { AnalyticsQuickActions } from "@/features/admin/analytics/analytics-quick-actions"
import { AnalyticsRecentActivity } from "@/features/admin/analytics/analytics-recent-activity"
import { AnalyticsCalendarWidget } from "@/features/admin/analytics/analytics-calendar-widget"
import { AnalyticsNotifications } from "@/features/admin/analytics/analytics-notifications"
import { AnalyticsSearchFilter } from "@/features/admin/analytics/analytics-search-filter"
import { AnalyticsExportReports } from "@/features/admin/analytics/analytics-export-reports"

// Charts
import { VisitorTrendChart } from "@/features/admin/analytics/visitor-trend-chart"
import { ProjectCategoryChart } from "@/features/admin/analytics/project-category-chart"
import { SkillsDistributionChart } from "@/features/admin/analytics/skills-distribution-chart"
import { BlogActivityChart } from "@/features/admin/analytics/blog-activity-chart"
import { ContactMessagesChart } from "@/features/admin/analytics/contact-messages-chart"
import { AiUsageChart } from "@/features/admin/analytics/ai-usage-chart"
import { CertificateIssuerChart } from "@/features/admin/analytics/certificate-issuer-chart"

export const metadata: Metadata = {
  title: "Owner BI Dashboard — Admin",
  robots: { index: false, follow: false },
}

interface DashboardPageProps {
  searchParams: Promise<{ timeRange?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireAdmin()
  const params = await searchParams
  const timeRange = params.timeRange || "30d"

  const analyticsData = await getDashboardAnalyticsData(timeRange)
  const supabase = await createClient()

  // Fetch search items for client-side search bar
  const [projectsRes, blogsRes, skillsRes, certsRes, msgsRes] = await Promise.all([
    supabase.from("projects").select("id, title").limit(10),
    supabase.from("blogs").select("id, title").limit(10),
    supabase.from("skills").select("id, name").limit(10),
    supabase.from("certificates").select("id, title").limit(10),
    supabase.from("contact_messages").select("id, name, subject").limit(10),
  ])

  const searchItems = [
    ...(projectsRes.data ?? []).map((p) => ({ id: `p-${p.id}`, title: p.title, type: "Project" as const, href: `/admin/projects/${p.id}/edit` })),
    ...(blogsRes.data ?? []).map((b) => ({ id: `b-${b.id}`, title: b.title, type: "Blog" as const, href: `/admin/blog/${b.id}/edit` })),
    ...(skillsRes.data ?? []).map((s) => ({ id: `s-${s.id}`, title: s.name, type: "Skill" as const, href: "/admin/skills" })),
    ...(certsRes.data ?? []).map((c) => ({ id: `c-${c.id}`, title: c.title, type: "Certificate" as const, href: `/admin/certificates/${c.id}/edit` })),
    ...(msgsRes.data ?? []).map((m) => ({ id: `m-${m.id}`, title: `${m.name}: ${m.subject}`, type: "Message" as const, href: "/admin/messages" })),
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Report Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          title="Owner Analytics &amp; Intelligence"
          description="Real-time performance metrics, portfolio insights, visitor traffic, and AI telemetry."
        />
        <div className="flex flex-wrap items-center gap-3">
          <AnalyticsExportReports data={analyticsData} />
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="glass rounded-2xl border border-white/10 p-4">
        <AnalyticsSearchFilter items={searchItems} />
      </div>

      {/* Notifications & System Alerts */}
      <AnalyticsNotifications
        unreadMessages={analyticsData.portfolioStats.unreadContactMessages}
        draftProjects={analyticsData.portfolioStats.draftProjects}
        draftBlogs={analyticsData.portfolioStats.draftBlogs}
        totalErrorLogs={analyticsData.adminSystemStats.totalErrorLogs}
      />

      {/* Quick Actions Bar */}
      <AnalyticsQuickActions />

      {/* Animated KPI Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase">Key Performance Indicators</h3>
        <AnalyticsKpiCards
          portfolioStats={analyticsData.portfolioStats}
          aiStats={analyticsData.aiAssistantStats}
          trafficStats={analyticsData.trafficStats}
          adminStats={analyticsData.adminSystemStats}
        />
      </div>

      {/* Interactive Recharts Section */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase">Data Visualizations &amp; Trends</h3>

        {/* Row 1: Traffic Trend + Project Categories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl border border-white/10 p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Visitor &amp; Page View Trend</h4>
                <p className="text-xs text-white/50">Daily traffic breakdown and page views</p>
              </div>
              <span className="text-[10px] font-mono text-blue-400 border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {analyticsData.trafficStats.totalVisitors} Total Visitors
              </span>
            </div>
            <VisitorTrendChart data={analyticsData.charts.visitorTrend} />
          </div>

          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Project Categories</h4>
            <p className="text-xs text-white/50">Distribution across tech domains</p>
            <ProjectCategoryChart data={analyticsData.charts.projectCategories} />
          </div>
        </div>

        {/* Row 2: Skills Distribution + Blog Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Skills Distribution</h4>
            <p className="text-xs text-white/50">Breakdown of technical proficiencies</p>
            <SkillsDistributionChart data={analyticsData.charts.skillsDistribution} />
          </div>

          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Blog Activity &amp; Reader Views</h4>
            <p className="text-xs text-white/50">Articles published vs total views</p>
            <BlogActivityChart data={analyticsData.charts.blogActivity} />
          </div>
        </div>

        {/* Row 3: Messages Trend + AI Usage + Certificate Issuers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Contact Inquiries</h4>
            <p className="text-xs text-white/50">Incoming visitor messages</p>
            <ContactMessagesChart data={analyticsData.charts.contactTrend} />
          </div>

          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">AI Assistant Telemetry</h4>
            <p className="text-xs text-white/50">Conversations &amp; questions asked</p>
            <AiUsageChart data={analyticsData.charts.aiUsageTrend} />
          </div>

          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Certificates by Issuer</h4>
            <p className="text-xs text-white/50">Credentials breakdown</p>
            <CertificateIssuerChart data={analyticsData.charts.certificateCategories} />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Feed & Calendar Widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pt-4">
        <AnalyticsRecentActivity activities={analyticsData.recentActivity} />
        <AnalyticsCalendarWidget events={analyticsData.calendarEvents} />
      </div>
    </div>
  )
}
