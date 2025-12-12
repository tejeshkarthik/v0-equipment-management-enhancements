"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const utilizationData = [
  { month: "Jan", utilization: 72, target: 80 },
  { month: "Feb", utilization: 78, target: 80 },
  { month: "Mar", utilization: 65, target: 80 },
  { month: "Apr", utilization: 82, target: 80 },
  { month: "May", utilization: 88, target: 80 },
  { month: "Jun", utilization: 92, target: 80 },
]

const revenueData = [
  { month: "Jan", revenue: 245000, cost: 95000 },
  { month: "Feb", revenue: 321000, cost: 105000 },
  { month: "Mar", revenue: 198000, cost: 89000 },
  { month: "Apr", revenue: 421000, cost: 115000 },
  { month: "May", revenue: 531000, cost: 132000 },
  { month: "Jun", revenue: 612000, cost: 155000 },
]

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analytics</h2>
        <p className="text-muted-foreground">Equipment utilization and revenue analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Equipment Utilization Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="utilization" stroke="#2563eb" name="Actual Utilization %" />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" name="Target %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue vs Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
