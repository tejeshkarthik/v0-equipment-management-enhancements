"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Download,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileSpreadsheet,
  Send,
  AlertTriangle,
} from "lucide-react"

interface WeeklyReportModalProps {
  isOpen: boolean
  onClose: () => void
}

interface WeeklyAssetUtilization {
  assetId: string
  assetName: string
  category: string
  jobsite: string
  bu: string
  hours: number
  utilization: number
  idlePercent: number
  threshold: number
  trend: "up" | "down" | "stable"
  prevWeek: number
}

const weeklyAssets: WeeklyAssetUtilization[] = [
  {
    assetId: "EQ-2847",
    assetName: "CAT 336 Excavator",
    category: "Excavators",
    jobsite: "LA-2847 Highway",
    bu: "FSG",
    hours: 42,
    utilization: 84,
    idlePercent: 16,
    threshold: 20,
    trend: "up",
    prevWeek: 78,
  },
  {
    assetId: "EQ-1923",
    assetName: "Komatsu D65 Dozer",
    category: "Dozers",
    jobsite: "TX-1156 Port",
    bu: "MAR",
    hours: 38,
    utilization: 76,
    idlePercent: 14,
    threshold: 12,
    trend: "down",
    prevWeek: 82,
  },
  {
    assetId: "EQ-3156",
    assetName: "Volvo A40G Haul Truck",
    category: "Off-Road Trucks",
    jobsite: "LA-3321 Levee",
    bu: "FSG",
    hours: 44,
    utilization: 88,
    idlePercent: 22,
    threshold: 15,
    trend: "up",
    prevWeek: 85,
  },
  {
    assetId: "EQ-7892",
    assetName: "Liebherr LTM 1100 Crane",
    category: "Cranes",
    jobsite: "LA-3321 Levee",
    bu: "FSG",
    hours: 28,
    utilization: 56,
    idlePercent: 32,
    threshold: 35,
    trend: "stable",
    prevWeek: 55,
  },
  {
    assetId: "EQ-9012",
    assetName: "CAT D8T Bulldozer",
    category: "Dozers",
    jobsite: "Southern Stone",
    bu: "SSS",
    hours: 46,
    utilization: 92,
    idlePercent: 8,
    threshold: 12,
    trend: "up",
    prevWeek: 88,
  },
  {
    assetId: "EQ-6666",
    assetName: "CAT 745 Haul Truck",
    category: "Off-Road Trucks",
    jobsite: "TX-4455 Bridge",
    bu: "FSE",
    hours: 40,
    utilization: 80,
    idlePercent: 18,
    threshold: 15,
    trend: "down",
    prevWeek: 85,
  },
  {
    assetId: "EXC-089",
    assetName: "Komatsu PC200",
    category: "Excavators",
    jobsite: "TX-1156 Port",
    bu: "MAR",
    hours: 35,
    utilization: 70,
    idlePercent: 28,
    threshold: 20,
    trend: "down",
    prevWeek: 75,
  },
  {
    assetId: "DOZ-125",
    assetName: "CAT D6T Dozer",
    category: "Dozers",
    jobsite: "LA-2847 Highway",
    bu: "FSG",
    hours: 36,
    utilization: 72,
    idlePercent: 18,
    threshold: 12,
    trend: "stable",
    prevWeek: 71,
  },
]

const distributionList = [
  { name: "Lindsey Thurmon", role: "Equipment Manager", email: "lindsey@fives.com", checked: true },
  { name: "Trey Folk", role: "Operations Director", email: "trey@fives.com", checked: true },
  { name: "Ashley Roberts", role: "Controller", email: "ashley@fives.com", checked: true },
  { name: "Eric Fauveau", role: "Director of Pre-Construction", email: "eric@fives.com", checked: true },
]

const getTrendIcon = (trend: string, prevWeek: number, current: number) => {
  const diff = current - prevWeek
  switch (trend) {
    case "up":
      return (
        <span className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-3 h-3" />+{diff}%
        </span>
      )
    case "down":
      return (
        <span className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-3 h-3" />
          {diff}%
        </span>
      )
    default:
      return (
        <span className="flex items-center gap-1 text-gray-500">
          <Minus className="w-3 h-3" />
          0%
        </span>
      )
  }
}

export default function WeeklyReportModal({ isOpen, onClose }: WeeklyReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState("current")
  const [filterBU, setFilterBU] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [recipients, setRecipients] = useState(distributionList.map((d) => d.checked))
  const [generated, setGenerated] = useState(false)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)

  let filteredAssets = [...weeklyAssets]
  if (filterBU !== "all") filteredAssets = filteredAssets.filter((a) => a.bu === filterBU)
  if (filterCategory !== "all") filteredAssets = filteredAssets.filter((a) => a.category === filterCategory)

  const thresholdBreaches = filteredAssets.filter((a) => a.idlePercent > a.threshold)
  const avgUtilization = Math.round(filteredAssets.reduce((sum, a) => sum + a.utilization, 0) / filteredAssets.length)
  const totalHours = filteredAssets.reduce((sum, a) => sum + a.hours, 0)
  const totalIdleHours = Math.round(filteredAssets.reduce((sum, a) => sum + (a.hours * a.idlePercent) / 100, 0))
  const prevWeekAvg = Math.round(filteredAssets.reduce((sum, a) => sum + a.prevWeek, 0) / filteredAssets.length)
  const weekOverWeek = avgUtilization - prevWeekAvg

  const handleGenerate = () => {
    setGenerated(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Weekly Utilization Report
          </DialogTitle>
          <DialogDescription>
            {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 items-center py-4">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="last">Last Week</SelectItem>
              <SelectItem value="2weeks">2 Weeks Ago</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBU} onValueChange={setFilterBU}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All BUs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All BUs</SelectItem>
              <SelectItem value="FSG">FSG</SelectItem>
              <SelectItem value="MAR">Marine</SelectItem>
              <SelectItem value="SSS">SSS</SelectItem>
              <SelectItem value="FSE">FSE</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Excavators">Excavators</SelectItem>
              <SelectItem value="Dozers">Dozers</SelectItem>
              <SelectItem value="Cranes">Cranes</SelectItem>
              <SelectItem value="Off-Road Trucks">Off-Road Trucks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Active Assets</p>
            <p className="text-2xl font-bold">{filteredAssets.length}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Avg Utilization</p>
            <p className="text-2xl font-bold text-blue-600">{avgUtilization}%</p>
            <Badge
              className={`text-xs ${weekOverWeek >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {weekOverWeek >= 0 ? "+" : ""}
              {weekOverWeek}% WoW
            </Badge>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold">{totalHours}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Idle Hours</p>
            <p className="text-2xl font-bold text-muted-foreground">{totalIdleHours}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Threshold Breaches</p>
            <p className="text-2xl font-bold text-red-600">{thresholdBreaches.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-2 font-semibold">Asset</th>
                <th className="text-left py-3 px-2 font-semibold">Category</th>
                <th className="text-left py-3 px-2 font-semibold">Job Site</th>
                <th className="text-center py-3 px-2 font-semibold">BU</th>
                <th className="text-right py-3 px-2 font-semibold">Hours</th>
                <th className="text-right py-3 px-2 font-semibold">Utilization</th>
                <th className="text-right py-3 px-2 font-semibold">Idle %</th>
                <th className="text-center py-3 px-2 font-semibold">Threshold</th>
                <th className="text-center py-3 px-2 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.assetId}
                  className={`border-b hover:bg-muted/50 ${asset.idlePercent > asset.threshold ? "bg-red-50" : ""}`}
                >
                  <td className="py-2 px-2">
                    <p className="font-medium">{asset.assetId}</p>
                    <p className="text-xs text-muted-foreground">{asset.assetName}</p>
                  </td>
                  <td className="py-2 px-2">{asset.category}</td>
                  <td className="py-2 px-2 text-muted-foreground">{asset.jobsite}</td>
                  <td className="py-2 px-2 text-center">
                    <Badge variant="outline" className="text-xs">
                      {asset.bu}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 text-right font-mono">{asset.hours}</td>
                  <td className="py-2 px-2 text-right">
                    <span
                      className={`font-semibold ${asset.utilization >= 80 ? "text-green-600" : asset.utilization >= 60 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {asset.utilization}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span
                      className={
                        asset.idlePercent > asset.threshold ? "text-red-600 font-bold" : "text-muted-foreground"
                      }
                    >
                      {asset.idlePercent}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {asset.idlePercent > asset.threshold ? (
                      <Badge className="bg-red-100 text-red-800 text-xs">⚠ &gt;{asset.threshold}%</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 text-xs">✓ ≤{asset.threshold}%</Badge>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-xs">
                    {getTrendIcon(asset.trend, asset.prevWeek, asset.utilization)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {thresholdBreaches.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="font-semibold text-red-800">Threshold Breaches ({thresholdBreaches.length})</h3>
            </div>
            <div className="space-y-1 text-sm">
              {thresholdBreaches.map((asset) => (
                <div key={asset.assetId} className="text-red-700">
                  <span className="font-medium">{asset.assetId}</span> - {asset.assetName}: {asset.idlePercent}% idle
                  (threshold: {asset.threshold}%)
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <h3 className="font-semibold mb-3">Distribution List</h3>
          <div className="flex flex-wrap gap-3">
            {distributionList.map((person, idx) => (
              <label key={idx} className="flex items-center gap-2 p-2 bg-muted rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={recipients[idx]}
                  onChange={(e) => {
                    const newRecipients = [...recipients]
                    newRecipients[idx] = e.target.checked
                    setRecipients(newRecipients)
                  }}
                  className="rounded"
                />
                <span className="text-sm">{person.name}</span>
              </label>
            ))}
          </div>
        </div>

        {generated && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">
              Report generated! <span className="text-green-600">4 hours saved vs manual process</span>
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleGenerate}>
            <Calendar className="w-4 h-4 mr-2" />
            Generate Weekly Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Email to PMs/Supts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
