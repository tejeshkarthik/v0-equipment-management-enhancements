"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, Wrench, AlertTriangle, TrendingUp, Download, FileText, Calendar, MapPin } from "lucide-react"
import DailyReportModal from "../daily-report-modal"
import WeeklyReportModal from "../weekly-report-modal"

interface KPICard {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: any
  color: string
}

interface ActivityItem {
  id: string
  type: "request" | "transfer" | "maintenance" | "alert"
  message: string
  time: string
  status: string
}

interface MaintenanceItem {
  assetId: string
  assetName: string
  pmType: string
  dueDate: string
  status: "overdue" | "due-soon" | "scheduled"
}

const kpiCards: KPICard[] = [
  {
    title: "Total Fleet",
    value: 267,
    icon: Truck,
    color: "text-blue-600",
    change: "+3 this month",
    changeType: "positive",
  },
  {
    title: "Fleet Utilization",
    value: "78%",
    icon: TrendingUp,
    color: "text-green-600",
    change: "+5% vs last month",
    changeType: "positive",
  },
  {
    title: "Active Rentals",
    value: 142,
    icon: Clock,
    color: "text-emerald-600",
    change: "53% of fleet",
    changeType: "neutral",
  },
  {
    title: "In Maintenance",
    value: 18,
    icon: Wrench,
    color: "text-yellow-600",
    change: "7% of fleet",
    changeType: "neutral",
  },
  {
    title: "PM Overdue",
    value: 3,
    icon: AlertTriangle,
    color: "text-red-600",
    change: "-2 from last week",
    changeType: "positive",
  },
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "request",
    message: "New LOR REQ-006: CAT 320 Excavator for Bridge Project",
    time: "10 min ago",
    status: "Pending",
  },
  {
    id: "2",
    type: "transfer",
    message: "EQ-3156 transferred from LA-2847 to LA-3321",
    time: "25 min ago",
    status: "Completed",
  },
  {
    id: "3",
    type: "maintenance",
    message: "PM completed: EQ-9012 CAT D8T Bulldozer",
    time: "1 hr ago",
    status: "Completed",
  },
  {
    id: "4",
    type: "alert",
    message: "Idle threshold exceeded: DOZ-125 at LA-2847 (18%)",
    time: "2 hrs ago",
    status: "Active",
  },
  { id: "5", type: "request", message: "Off-rent requested: REQ-003 Volvo A40G", time: "3 hrs ago", status: "Pending" },
]

const upcomingMaintenance: MaintenanceItem[] = [
  {
    assetId: "EQ-2847",
    assetName: "CAT 336 Excavator",
    pmType: "500-hr Service",
    dueDate: "Overdue (521 hrs)",
    status: "overdue",
  },
  {
    assetId: "EQ-1923",
    assetName: "Komatsu D65 Dozer",
    pmType: "500-hr Service",
    dueDate: "Due in 158 hrs",
    status: "due-soon",
  },
  {
    assetId: "EQ-3156",
    assetName: "Volvo A40G",
    pmType: "500-hr Service",
    dueDate: "Due in 22 hrs",
    status: "due-soon",
  },
  {
    assetId: "EQ-7892",
    assetName: "Liebherr LTM 1100",
    pmType: "500-hr Service",
    dueDate: "Due in 44 hrs",
    status: "due-soon",
  },
]

const fleetByStatus = [
  { status: "Available", count: 68, color: "bg-green-500", pct: 25 },
  { status: "On Rent", count: 142, color: "bg-blue-500", pct: 53 },
  { status: "Maintenance", count: 18, color: "bg-yellow-500", pct: 7 },
  { status: "In Transit", count: 12, color: "bg-purple-500", pct: 5 },
  { status: "Out of Service", count: 8, color: "bg-red-500", pct: 3 },
  { status: "Yard/Standby", count: 19, color: "bg-gray-400", pct: 7 },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "request":
      return <FileText className="w-4 h-4 text-blue-600" />
    case "transfer":
      return <MapPin className="w-4 h-4 text-purple-600" />
    case "maintenance":
      return <Wrench className="w-4 h-4 text-green-600" />
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getMaintenanceStatusBadge = (status: string) => {
  switch (status) {
    case "overdue":
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
    case "due-soon":
      return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
    case "scheduled":
      return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function Dashboard() {
  const [showDailyReport, setShowDailyReport] = useState(false)
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header with Report Buttons */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment Dashboard</h1>
          <p className="text-muted-foreground">Real-time fleet overview and KPIs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDailyReport(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Daily Report
          </Button>
          <Button variant="outline" onClick={() => setShowWeeklyReport(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Weekly Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpiCards.map((kpi, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                {kpi.change && (
                  <p
                    className={`text-xs ${kpi.changeType === "positive" ? "text-green-600" : kpi.changeType === "negative" ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    {kpi.change}
                  </p>
                )}
              </div>
              <kpi.icon className={`w-8 h-8 ${kpi.color} opacity-20`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fleet by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fleetByStatus.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.status}</span>
                    <span className="font-medium">
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Fleet</span>
                <span>267 Assets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              PM Schedule
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((item) => (
                <div
                  key={item.assetId}
                  className={`p-3 rounded-lg ${item.status === "overdue" ? "bg-red-50 border border-red-200" : "bg-muted"}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-sm">{item.assetId}</p>
                      <p className="text-xs text-muted-foreground">{item.assetName}</p>
                    </div>
                    {getMaintenanceStatusBadge(item.status)}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.pmType}</span>
                    <span className={item.status === "overdue" ? "text-red-600 font-medium" : ""}>{item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilization by Business Unit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Utilization by Business Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { bu: "FSG", name: "Five-S Group", assets: 187, utilization: 82, color: "bg-blue-500" },
              { bu: "MAR", name: "Five-S Marine", assets: 45, utilization: 76, color: "bg-teal-500" },
              { bu: "SSS", name: "Southern Stone", assets: 38, utilization: 91, color: "bg-orange-500" },
              { bu: "FSE", name: "Five-S Equipment", assets: 42, utilization: 68, color: "bg-purple-500" },
            ].map((bu) => (
              <div key={bu.bu} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${bu.color}`} />
                  <span className="font-semibold">{bu.bu}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{bu.name}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Assets</span>
                    <span className="font-medium">{bu.assets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span
                      className={`font-bold ${bu.utilization >= 80 ? "text-green-600" : bu.utilization >= 60 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {bu.utilization}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Modals */}
      <DailyReportModal isOpen={showDailyReport} onClose={() => setShowDailyReport(false)} />
      <WeeklyReportModal isOpen={showWeeklyReport} onClose={() => setShowWeeklyReport(false)} />
    </div>
  )
}
