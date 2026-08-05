"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface VisitorTrendChartProps {
  data: Array<{ date: string; visitors: number; pageViews: number }>
}

export function VisitorTrendChart({ data }: VisitorTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-2xl mb-2">📈</p>
        <p className="text-sm font-medium text-white/60">No traffic data recorded yet</p>
        <p className="text-xs text-white/30 mt-1">Visitor trends will appear here as users browse your portfolio.</p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 14, 26, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            name="Page Views"
            stroke="#a855f7"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#viewsGrad)"
          />
          <Area
            type="monotone"
            dataKey="visitors"
            name="Unique Visitors"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#visitorGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
