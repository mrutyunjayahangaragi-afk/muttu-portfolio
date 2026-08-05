"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface SkillsDistributionChartProps {
  data: Array<{ category: string; count: number }>
}

const SKILL_COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
]

export function SkillsDistributionChart({ data }: SkillsDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-2xl mb-2">⚡</p>
        <p className="text-sm font-medium text-white/60">No skill categories available</p>
        <p className="text-xs text-white/30 mt-1">Add skills in the admin panel to view category stats.</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
            nameKey="category"
          >
            {data.map((_, index) => (
              <Cell key={`cell-skill-${index}`} fill={SKILL_COLORS[index % SKILL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 14, 26, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-white/70">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
