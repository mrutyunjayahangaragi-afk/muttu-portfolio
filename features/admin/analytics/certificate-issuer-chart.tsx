"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface CertificateIssuerChartProps {
  data: Array<{ issuer: string; count: number }>
}

const ISSUER_COLORS = ["#f59e0b", "#3b82f6", "#ec4899", "#10b981", "#8b5cf6"]

export function CertificateIssuerChart({ data }: CertificateIssuerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-2xl mb-2">📜</p>
        <p className="text-sm font-medium text-white/60">No certificates added yet</p>
        <p className="text-xs text-white/30 mt-1">Add certificates to see breakdown by issuing organization.</p>
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
            outerRadius={75}
            paddingAngle={4}
            dataKey="count"
            nameKey="issuer"
          >
            {data.map((_, index) => (
              <Cell key={`cell-cert-${index}`} fill={ISSUER_COLORS[index % ISSUER_COLORS.length]} />
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
