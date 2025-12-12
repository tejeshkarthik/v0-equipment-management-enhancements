"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, AlertTriangle, Clock, Calendar, Search, Filter, X } from "lucide-react"

interface PMAsset {
  id: string
  name: string
  category: string
  currentHours: number
  lastPMHours: number
  nextPMDue: number
  hoursUntilPM: number
  status: "overdue" | "critical" | "warning" | "good"
  location: string
  bu: string
}

const pmAssets: PMAsset[] = [
  {
    id: "EQ-2847",
    name: "CAT 336 Excavator",
    category: "Excavators",
    currentHours: 4521,
    lastPMHours: 4000,
    nextPMDue: 4500,
    hoursUntilPM: -21,
    status: "overdue",
    location: "LA-2847",
    bu: "FSG",
  },
  {
    id: "EQ-3156",
    name: "Volvo A40G Haul Truck",
    category: "Off-Road Trucks",
    currentHours: 3478,
    lastPMHours: 3000,
    nextPMDue: 3500,
    hoursUntilPM: 22,
    status: "critical",
    location: "LA-3321",
    bu: "FSG",
  },
  {
    id: "EQ-1923",
    name: "Komatsu D65 Dozer",
    category: "Dozers",
    currentHours: 2342,
    lastPMHours: 2000,
    nextPMDue: 2500,
    hoursUntilPM: 158,
    status: "warning",
    location: "TX-1156",
    bu: "MAR",
  },
  {
    id: "EQ-7892",
    name: "Liebherr LTM 1100 Crane",
    category: "Cranes",
    currentHours: 1956,
    lastPMHours: 1500,
    nextPMDue: 2000,
    hoursUntilPM: 44,
    status: "critical",
    location: "LA-3321",
    bu: "FSG",
  },
  {
    id: "EQ-9012",
    name: "CAT D8T Bulldozer",
    category: "Dozers",
    currentHours: 5123,
    lastPMHours: 4500,
    nextPMDue: 5000,
    hoursUntilPM: -123,
    status: "overdue",
    location: "SSQ-001",
    bu: "SSS",
  },
  {
    id: "DOZ-125",
    name: "CAT D6T Dozer",
    category: "Dozers",
    currentHours: 2789,
    lastPMHours: 2500,
    nextPMDue: 3000,
    hoursUntilPM: 211,
    status: "good",
    location: "LA-2847",
    bu: "FSG",
  },
  {
    id: "EXC-089",
    name: "Komatsu PC200",
    category: "Excavators",
    currentHours: 3891,
    lastPMHours: 3500,
    nextPMDue: 4000,
    hoursUntilPM: 109,
    status: "warning",
    location: "TX-1156",
    bu: "MAR",
  },
  {
    id: "EQ-6666",
    name: "CAT 745 Haul Truck",
    category: "Off-Road Trucks",
    currentHours: 4234,
    lastPMHours: 4000,
    nextPMDue: 4500,
    hoursUntilPM: 266,
    status: "good",
    location: "TX-4455",
    bu: "FSE",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "overdue":
      return <Badge className="bg-red-600 text-white">Overdue</Badge>
    case "critical":
      return <Badge className="bg-orange-600 text-white">Critical (&lt;50hrs)</Badge>
    case "warning":
      return <Badge className="bg-yellow-600 text-white">Due Soon (&lt;200hrs)</Badge>
    case "good":
      return <Badge className="bg-green-600 text-white">Good (&gt;200hrs)</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

interface SchedulePMModalProps {
  asset: PMAsset
  onClose: () => void
  onSubmit: (data: any) => void
}

function SchedulePMModal({ asset, onClose, onSubmit }: SchedulePMModalProps) {
  const [formData, setFormData] = useState({
    scheduledDate: new Date().toISOString().split("T")[0],
    technician: "",
    estimatedHours: "4",
    parts: "",
    notes: "",
  })

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Schedule 500-Hour PM Service</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {asset.id} - {asset.name}
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Equipment Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Hours</p>
                <p className="font-bold text-foreground">{asset.currentHours.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last PM Hours</p>
                <p className="font-medium text-foreground">{asset.lastPMHours.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next PM Due</p>
                <p className="font-medium text-foreground">{asset.nextPMDue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hours Until PM</p>
                <p
                  className={`font-bold ${asset.hoursUntilPM < 0 ? "text-red-600" : asset.hoursUntilPM < 50 ? "text-orange-600" : "text-green-600"}`}
                >
                  {asset.hoursUntilPM > 0 ? asset.hoursUntilPM : `${Math.abs(asset.hoursUntilPM)} hrs OVERDUE`}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scheduled Date *</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Hours *</Label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assigned Technician *</Label>
              <Select value={formData.technician} onValueChange={(v) => setFormData({ ...formData, technician: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Johnson - Lead Technician</SelectItem>
                  <SelectItem value="sarah">Sarah Williams - Heavy Equipment Specialist</SelectItem>
                  <SelectItem value="john">John Brown - Diesel Mechanic</SelectItem>
                  <SelectItem value="lisa">Lisa Davis - PM Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Required Parts/Materials</Label>
              <Textarea
                value={formData.parts}
                onChange={(e) => setFormData({ ...formData, parts: e.target.value })}
                placeholder="List parts needed: oil filters, hydraulic filters, engine oil, etc."
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Service Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional service notes, special instructions, known issues..."
                className="min-h-20"
              />
            </div>
          </div>

          {asset.status === "overdue" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">PM Service Overdue</p>
                <p className="text-sm text-red-700 mt-1">
                  This equipment is {Math.abs(asset.hoursUntilPM)} hours past due for preventive maintenance. Schedule
                  immediately to prevent breakdowns.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-accent hover:bg-accent/90"
              onClick={handleSubmit}
              disabled={!formData.technician}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule PM Service
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function PMSchedule() {
  const [selectedAsset, setSelectedAsset] = useState<PMAsset | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterBU, setFilterBU] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  let filteredAssets = [...pmAssets]
  if (filterStatus !== "all") filteredAssets = filteredAssets.filter((a) => a.status === filterStatus)
  if (filterBU !== "all") filteredAssets = filteredAssets.filter((a) => a.bu === filterBU)
  if (searchTerm)
    filteredAssets = filteredAssets.filter(
      (a) =>
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const overdueCount = pmAssets.filter((a) => a.status === "overdue").length
  const criticalCount = pmAssets.filter((a) => a.status === "critical").length
  const warningCount = pmAssets.filter((a) => a.status === "warning").length

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">500-Hour PM Schedule</h2>
        <p className="text-muted-foreground">Track and schedule preventive maintenance for all equipment</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600">Critical (&lt;50hrs)</p>
              <p className="text-2xl font-bold text-orange-700">{criticalCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600">Due Soon (&lt;200hrs)</p>
              <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Total Tracked</p>
              <p className="text-2xl font-bold text-green-700">{pmAssets.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by equipment ID or name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="critical">Critical (&lt;50hrs)</SelectItem>
              <SelectItem value="warning">Due Soon (&lt;200hrs)</SelectItem>
              <SelectItem value="good">Good (&gt;200hrs)</SelectItem>
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
        </div>
      </Card>

      {/* PM Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Equipment ID</th>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-center py-3 px-4 font-semibold">BU</th>
                <th className="text-right py-3 px-4 font-semibold">Current Hours</th>
                <th className="text-right py-3 px-4 font-semibold">Last PM</th>
                <th className="text-right py-3 px-4 font-semibold">Next PM Due</th>
                <th className="text-right py-3 px-4 font-semibold">Hours Until PM</th>
                <th className="text-center py-3 px-4 font-semibold">Status</th>
                <th className="text-right py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className={`border-b hover:bg-muted/50 ${asset.status === "overdue" ? "bg-red-50" : ""}`}
                >
                  <td className="py-3 px-4 font-medium">{asset.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.location}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{asset.category}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      {asset.bu}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{asset.currentHours.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                    {asset.lastPMHours.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{asset.nextPMDue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-bold ${asset.hoursUntilPM < 0 ? "text-red-600" : asset.hoursUntilPM < 50 ? "text-orange-600" : asset.hoursUntilPM < 200 ? "text-yellow-600" : "text-green-600"}`}
                    >
                      {asset.hoursUntilPM > 0 ? asset.hoursUntilPM : `(${Math.abs(asset.hoursUntilPM)})`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(asset.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelectedAsset(asset)}
                      className={
                        asset.status === "overdue" || asset.status === "critical" ? "bg-red-600 hover:bg-red-700" : ""
                      }
                    >
                      Schedule PM
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedAsset && (
        <SchedulePMModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSubmit={(data) => {
            console.log("PM scheduled:", data)
          }}
        />
      )}
    </div>
  )
}
