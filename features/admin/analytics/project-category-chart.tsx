"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface ProjectCategoryChartProps {
  data: Array<{ category: string; count: number }>
}

const COLORS = [
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
]

export function ProjectCategoryChart({ data }: ProjectCategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-2xl mb-2">📁</p>
        <p className="text-sm font-medium text-white/60">No project categories yet</p>
        <p className="text-xs text-white/30 mt-1">Add projects to visualize your domain distribution.</p>
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
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
