"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Activity, CheckCircle, Clock, X } from "lucide-react"
import { useState } from "react"

const kpiData = [
  {
    title: "Fleet Size",
    value: "312",
    subtitle: "↑ 5 added this month",
    icon: TrendingUp,
    color: "bg-blue-500",
    action: "navigate",
    target: "equipment",
  },
  {
    title: "Utilization Rate",
    value: "78%",
    subtitle: "↑ 3% vs last month",
    icon: Activity,
    color: "bg-green-500",
    action: "modal",
    target: "utilization",
  },
  {
    title: "Equipment Available",
    value: "68",
    subtitle: "Ready for deployment",
    icon: CheckCircle,
    color: "bg-emerald-500",
    action: "navigate",
    target: "equipment",
    filter: "Available",
  },
  {
    title: "Pending Requests",
    value: "12",
    subtitle: "3 urgent",
    icon: Clock,
    color: "bg-orange-500",
    action: "navigate",
    target: "lor",
  },
]

const statusData = [
  { name: "Available", value: 68, fill: "#10B981" },
  { name: "On Rent", value: 187, fill: "#2563EB" },
  { name: "In Maintenance", value: 34, fill: "#F59E0B" },
  { name: "Out of Service", value: 23, fill: "#EF4444" },
]

const activityFeed = [
  {
    id: 1,
    description: "Excavator #19730 checked out to Bunge Project",
    time: "2 hours ago",
    icon: "📤",
    action: "lor",
    ref: "REQ-007",
  },
  {
    id: 2,
    description: "Work Order #WO-1234 completed on Dozer #DOZ-125",
    time: "4 hours ago",
    icon: "✅",
    action: "workorder",
    ref: "WO-1234",
  },
  {
    id: 3,
    description: "Pre-deployment inspection passed for Dump Truck #DT-456",
    time: "6 hours ago",
    icon: "🔍",
    action: "inspection",
    ref: "INS-456",
  },
  {
    id: 4,
    description: "New request REQ-459 submitted by John Smith",
    time: "1 day ago",
    icon: "📋",
    action: "lor",
    ref: "REQ-459",
  },
  {
    id: 5,
    description: "Excavator #19731 maintenance completed",
    time: "2 days ago",
    icon: "🔧",
    action: "equipment",
    ref: "EXC-002",
  },
]

const maintenanceData = [
  {
    id: "EXC-001",
    type: "Excavator",
    serviceDue: "250-Hour Oil Change",
    dueDate: "2025-11-20",
    daysUntil: 9,
    status: "warning",
  },
  {
    id: "DOZ-002",
    type: "Dozer",
    serviceDue: "Hydraulic Filter",
    dueDate: "2025-11-15",
    daysUntil: 4,
    status: "critical",
  },
  {
    id: "DT-001",
    type: "Dump Truck",
    serviceDue: "Annual DOT Inspection",
    dueDate: "2025-11-25",
    daysUntil: 14,
    status: "safe",
  },
  {
    id: "GEN-001",
    type: "Generator",
    serviceDue: "500-Hour Service",
    dueDate: "2025-12-01",
    daysUntil: 20,
    status: "safe",
  },
  {
    id: "EXC-002",
    type: "Excavator",
    serviceDue: "Track Tension Check",
    dueDate: "2025-11-22",
    daysUntil: 11,
    status: "warning",
  },
  {
    id: "DT-002",
    type: "Dump Truck",
    serviceDue: "Brake Inspection",
    dueDate: "2025-11-12",
    daysUntil: 1,
    status: "critical",
  },
]

const utilizationTrendData = [
  { month: "May", utilization: 73 },
  { month: "June", utilization: 75 },
  { month: "July", utilization: 77 },
  { month: "August", utilization: 76 },
  { month: "September", utilization: 78 },
  { month: "October", utilization: 78 },
]

const topUtilized = [
  { name: "Mobile Crane 50T", utilization: 95 },
  { name: "Excavator CAT 320", utilization: 92 },
  { name: "Dump Truck 15T", utilization: 88 },
  { name: "Generator 50kW", utilization: 85 },
  { name: "Dozer CAT D6T", utilization: 82 },
]

const bottomUtilized = [
  { name: "Tower Crane 80T", utilization: 32 },
  { name: "Generator 100kW", utilization: 28 },
  { name: "Boom Lift 60ft", utilization: 25 },
  { name: "Specialist Equipment", utilization: 18 },
  { name: "Reserve Excavator", utilization: 12 },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "critical")
    return <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded">Critical</span>
  if (status === "warning")
    return <span className="text-xs font-semibold text-white bg-yellow-500 px-2 py-1 rounded">Due Soon</span>
  return <span className="text-xs font-semibold text-white bg-green-500 px-2 py-1 rounded">On Schedule</span>
}

function UtilizationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-card z-10">
            <h2 className="text-2xl font-bold text-foreground">Equipment Utilization Analytics</h2>
            <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground flex-shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Utilization Trend */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">6-Month Utilization Trend</h3>
              <div className="bg-muted p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={utilizationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => `${value}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="utilization"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ fill: "#2563EB", r: 5 }}
                      name="Fleet Utilization"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => 85}
                      stroke="#9ca3af"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target (85%)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Utilized */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Top 5 Most Utilized Equipment</h3>
              <div className="bg-muted p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topUtilized} layout="vertical" margin={{ left: 200, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={190} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="utilization" fill="#10B981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom 5 Utilized */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Bottom 5 Least Utilized Equipment</h3>
              <div className="bg-muted p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={bottomUtilized} layout="vertical" margin={{ left: 200, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={190} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="utilization" fill="#F59E0B" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg space-y-3">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recommendations</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex gap-2">
                  <span>⚠️</span>
                  <span>
                    <strong>Tower Crane 80T</strong> - Consider renting out or selling (32% utilization)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>⚠️</span>
                  <span>
                    <strong>Generator 100kW</strong> - Underutilized, explore rental opportunities (28% utilization)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>
                    <strong>Overall Fleet</strong> - Fleet performing well at 78% utilization, above 75% target
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-accent hover:bg-accent/90">Export Report</Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function MaintenanceScheduleModal({
  maintenance,
  onClose,
}: { maintenance: (typeof maintenanceData)[0]; onClose: () => void }) {
  const [formData, setFormData] = useState({
    scheduledDate: maintenance.dueDate,
    technician: "",
    duration: "",
    parts: "",
    notes: "",
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Schedule Maintenance</h2>
            <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Equipment</p>
              <p className="font-semibold text-foreground">{maintenance.id}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Service Type</p>
              <p className="font-semibold text-foreground">{maintenance.serviceDue}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Assigned Technician</label>
              <select
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              >
                <option>Select technician...</option>
                <option>Mike Johnson</option>
                <option>Sarah Williams</option>
                <option>John Brown</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Estimated Duration (hours)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 4"
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                className="w-full border border-border rounded px-3 py-2 text-foreground min-h-20"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90">Schedule Work Order</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const [showUtilizationModal, setShowUtilizationModal] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<(typeof maintenanceData)[0] | null>(null)
  const [onNavigate, setOnNavigate] = useState<(view: string) => void>(() => {})

  // Get onNavigate from parent through callback
  const handleKPIClick = (kpi: (typeof kpiData)[0]) => {
    if (kpi.action === "modal") {
      setShowUtilizationModal(true)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card
              key={idx}
              onClick={() => handleKPIClick(kpi)}
              className="p-6 bg-card hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{kpi.subtitle}</p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-foreground mb-4">Equipment by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityFeed.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-border last:border-0 hover:bg-muted/50 p-2 rounded cursor-pointer transition-colors"
              >
                <span className="text-xl mt-0.5">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Maintenance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Maintenance</h3>
          <a href="#" className="text-sm text-accent hover:underline">
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Equipment ID</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Service Type</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Days Until Due</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium text-foreground">{item.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.type}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.serviceDue}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.dueDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        item.status === "critical"
                          ? "text-red-600"
                          : item.status === "warning"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {item.daysUntil} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedMaintenance(item)}
                      className="text-accent hover:underline font-medium text-sm"
                    >
                      Schedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {showUtilizationModal && <UtilizationModal onClose={() => setShowUtilizationModal(false)} />}
      {selectedMaintenance && (
        <MaintenanceScheduleModal maintenance={selectedMaintenance} onClose={() => setSelectedMaintenance(null)} />
      )}
    </div>
  )
}
