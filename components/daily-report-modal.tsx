"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FileText,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Send,
} from "lucide-react"

interface DailyReportModalProps {
  isOpen: boolean
  onClose: () => void
}

interface APIFeed {
  id: string
  name: string
  type: "OEM" | "3rd Party"
  status: "connected" | "delayed" | "error"
  lastSync: string
  assetCount: number
  dataPoints: number
}

interface JobsiteUtilization {
  jobsite: string
  jobCode: string
  bu: string
  assetCount: number
  avgUtilization: number
  totalHours: number
  idleHours: number
}

interface IdleBreach {
  assetId: string
  assetName: string
  category: string
  idlePercent: number
  threshold: number
  jobsite: string
}

const apiFeeds: APIFeed[] = [
  {
    id: "1",
    name: "CAT VisionLink",
    type: "OEM",
    status: "connected",
    lastSync: "2 min ago",
    assetCount: 45,
    dataPoints: 12450,
  },
  {
    id: "2",
    name: "Komatsu Komtrax",
    type: "OEM",
    status: "connected",
    lastSync: "5 min ago",
    assetCount: 28,
    dataPoints: 8920,
  },
  {
    id: "3",
    name: "John Deere JD Link",
    type: "OEM",
    status: "connected",
    lastSync: "8 min ago",
    assetCount: 32,
    dataPoints: 9680,
  },
  {
    id: "4",
    name: "Volvo ActiveCare",
    type: "OEM",
    status: "connected",
    lastSync: "3 min ago",
    assetCount: 18,
    dataPoints: 5400,
  },
  {
    id: "5",
    name: "Liebherr LiDAT",
    type: "OEM",
    status: "delayed",
    lastSync: "45 min ago",
    assetCount: 8,
    dataPoints: 2100,
  },
  {
    id: "6",
    name: "Hyundai Hi-Mate",
    type: "OEM",
    status: "connected",
    lastSync: "12 min ago",
    assetCount: 12,
    dataPoints: 3600,
  },
  {
    id: "7",
    name: "New Holland PLM",
    type: "OEM",
    status: "connected",
    lastSync: "6 min ago",
    assetCount: 15,
    dataPoints: 4500,
  },
  {
    id: "8",
    name: "Bell Fleetmatic",
    type: "OEM",
    status: "connected",
    lastSync: "4 min ago",
    assetCount: 22,
    dataPoints: 6600,
  },
  {
    id: "9",
    name: "TrackUnit",
    type: "3rd Party",
    status: "connected",
    lastSync: "1 min ago",
    assetCount: 65,
    dataPoints: 19500,
  },
  {
    id: "10",
    name: "Teletrac Navman",
    type: "3rd Party",
    status: "error",
    lastSync: "2 hrs ago",
    assetCount: 22,
    dataPoints: 0,
  },
]

const jobsiteUtilization: JobsiteUtilization[] = [
  {
    jobsite: "LA-2847 Highway Expansion",
    jobCode: "2847-001",
    bu: "FSG",
    assetCount: 24,
    avgUtilization: 82,
    totalHours: 456,
    idleHours: 52,
  },
  {
    jobsite: "TX-1156 Port Dredging",
    jobCode: "1156-003",
    bu: "MAR",
    assetCount: 18,
    avgUtilization: 76,
    totalHours: 312,
    idleHours: 48,
  },
  {
    jobsite: "LA-3321 Levee Repair",
    jobCode: "3321-002",
    bu: "FSG",
    assetCount: 15,
    avgUtilization: 88,
    totalHours: 285,
    idleHours: 22,
  },
  {
    jobsite: "Southern Stone Quarry",
    jobCode: "SSQ-001",
    bu: "SSS",
    assetCount: 12,
    avgUtilization: 91,
    totalHours: 198,
    idleHours: 12,
  },
  {
    jobsite: "TX-4455 Bridge Construction",
    jobCode: "4455-001",
    bu: "FSE",
    assetCount: 8,
    avgUtilization: 74,
    totalHours: 142,
    idleHours: 28,
  },
  {
    jobsite: "Five-S Yard (Available)",
    jobCode: "YARD-001",
    bu: "FSG",
    assetCount: 42,
    avgUtilization: 0,
    totalHours: 0,
    idleHours: 0,
  },
]

const idleBreaches: IdleBreach[] = [
  {
    assetId: "EQ-3156",
    assetName: "Volvo A40G Haul Truck",
    category: "Off-Road Trucks",
    idlePercent: 22,
    threshold: 15,
    jobsite: "LA-3321 Levee",
  },
  {
    assetId: "DOZ-125",
    assetName: "CAT D6T Dozer",
    category: "Dozers",
    idlePercent: 18,
    threshold: 12,
    jobsite: "LA-2847 Highway",
  },
  {
    assetId: "EXC-089",
    assetName: "Komatsu PC200",
    category: "Excavators",
    idlePercent: 28,
    threshold: 20,
    jobsite: "TX-1156 Port",
  },
]

const distributionList = [
  { name: "Lindsey Thurmon", role: "Equipment Manager", email: "lindsey@fives.com", checked: true },
  { name: "Trey Folk", role: "Operations Director", email: "trey@fives.com", checked: true },
  { name: "Ashley Roberts", role: "Controller", email: "ashley@fives.com", checked: false },
  { name: "Eric Fauveau", role: "Director of Pre-Construction", email: "eric@fives.com", checked: false },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "delayed":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    case "error":
      return <XCircle className="w-4 h-4 text-red-600" />
    default:
      return null
  }
}

export default function DailyReportModal({ isOpen, onClose }: DailyReportModalProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [syncing, setSyncing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [recipients, setRecipients] = useState(distributionList.map((d) => d.checked))

  const connectedFeeds = apiFeeds.filter((f) => f.status === "connected").length
  const totalAssets = apiFeeds.reduce((sum, f) => sum + f.assetCount, 0)
  const fleetUtilization = 78

  const handleSyncAll = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Daily Utilization Report
          </DialogTitle>
          <DialogDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Feeds</p>
            <p className="text-2xl font-bold text-green-600">
              {connectedFeeds}/{apiFeeds.length}
            </p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Assets Tracked</p>
            <p className="text-2xl font-bold">{totalAssets}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Fleet Utilization</p>
            <p className="text-2xl font-bold text-blue-600">{fleetUtilization}%</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Idle Breaches</p>
            <p className="text-2xl font-bold text-red-600">{idleBreaches.length}</p>
            <p className="text-xs text-muted-foreground">Threshold exceeded</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="api">API Status</TabsTrigger>
            <TabsTrigger value="jobsite">By Jobsite</TabsTrigger>
            <TabsTrigger value="breaches">Idle Breaches</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Report Summary</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • {connectedFeeds} of {apiFeeds.length} telematics feeds reporting normally
                </li>
                <li>
                  • {totalAssets} assets tracked across {jobsiteUtilization.length} locations
                </li>
                <li>• Fleet utilization: {fleetUtilization}% (target: 75%)</li>
                <li>• {idleBreaches.length} assets exceeding idle thresholds</li>
                <li>• 1 API feed experiencing connection errors (Teletrac Navman)</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleSyncAll} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync All APIs"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {apiFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className={`p-3 rounded-lg border ${feed.status === "error" ? "border-red-200 bg-red-50" : feed.status === "delayed" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feed.status)}
                      <span className="font-medium">{feed.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feed.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span>{feed.lastSync}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assets:</span>
                      <span>{feed.assetCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Points:</span>
                      <span>{feed.dataPoints.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobsite">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Jobsite</th>
                  <th className="text-left py-2">Job Code</th>
                  <th className="text-center py-2">BU</th>
                  <th className="text-right py-2">Assets</th>
                  <th className="text-right py-2">Utilization</th>
                  <th className="text-right py-2">Total Hrs</th>
                  <th className="text-right py-2">Idle Hrs</th>
                </tr>
              </thead>
              <tbody>
                {jobsiteUtilization.map((js, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{js.jobsite}</td>
                    <td className="py-2 font-mono text-muted-foreground">{js.jobCode}</td>
                    <td className="py-2 text-center">
                      <Badge variant="outline" className="text-xs">
                        {js.bu}
                      </Badge>
                    </td>
                    <td className="py-2 text-right">{js.assetCount}</td>
                    <td className="py-2 text-right">
                      <span
                        className={
                          js.avgUtilization >= 80
                            ? "text-green-600 font-semibold"
                            : js.avgUtilization >= 60
                              ? "text-yellow-600"
                              : "text-muted-foreground"
                        }
                      >
                        {js.avgUtilization}%
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono">{js.totalHours}</td>
                    <td className="py-2 text-right font-mono text-muted-foreground">{js.idleHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="breaches">
            {idleBreaches.length > 0 ? (
              <div className="space-y-3">
                {idleBreaches.map((breach, idx) => (
                  <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold">{breach.assetId}</span>
                        <span className="text-muted-foreground ml-2">{breach.assetName}</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">{breach.category}</Badge>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600 font-bold">{breach.idlePercent}% idle</span>
                      <span className="text-muted-foreground"> (threshold: {breach.threshold}%)</span>
                      <span className="text-muted-foreground ml-4">• {breach.jobsite}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No idle threshold breaches today</div>
            )}
          </TabsContent>

          <TabsContent value="distribution">
            <div className="space-y-3">
              {distributionList.map((person, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
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
                  <div className="flex-1">
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {person.role} • {person.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {generated && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Report generated successfully at {new Date().toLocaleTimeString()}</span>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {generating ? "Generating..." : "Generate Report"}
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
            Email to Distribution
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
