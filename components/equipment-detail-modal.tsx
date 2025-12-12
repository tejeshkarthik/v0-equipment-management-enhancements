"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  MoreHorizontal,
  QrCode,
  History,
  ChevronDown,
  MapPin,
  Wifi,
  AlertTriangle,
  Cloud,
  Plus,
  BarChart3,
} from "lucide-react"
import { useState } from "react"

const assignmentHistoryData = [
  { date: "Aug 1", status: "Bunge Project" },
  { date: "Oct 31", status: "Bunge Project" },
  { date: "Nov 1", status: "Maintenance" },
  { date: "Nov 5", status: "Maintenance" },
  { date: "Nov 8", status: "Metro Transit" },
  { date: "Nov 30", status: "Metro Transit" },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-800",
    "On Rent": "bg-blue-100 text-blue-800",
    "In Maintenance": "bg-yellow-100 text-yellow-800",
    "Out of Service": "bg-red-100 text-red-800",
  }
  return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
}

interface EquipmentDetailModalProps {
  equipment: any
  onClose: () => void
  onNavigate?: (view: string) => void
}

export default function EquipmentDetailModal({ equipment, onClose, onNavigate }: EquipmentDetailModalProps) {
  const [useTemplate, setUseTemplate] = useState(true)
  const [expandRules, setExpandRules] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<any>(null)

  const rateTableData = [
    { type: "Hourly", amount: "$125/hr", effectiveDate: "01/01/2025", rules: "Applied for short-term usage" },
    { type: "Daily", amount: "$800/day", effectiveDate: "01/01/2025", rules: "Auto-applies if < 3 days" },
    { type: "Weekly", amount: "$4,200/wk", effectiveDate: "01/01/2025", rules: "Auto-applies if 3-7 days" },
    { type: "Monthly", amount: "$15,000/mo", effectiveDate: "01/01/2025", rules: "Auto-applies if > 176 hours" },
    { type: "Internal Rate", amount: "$110/hr", effectiveDate: "01/01/2025", rules: "For cross-BU assignments" },
    { type: "External Rate", amount: "$150/hr", effectiveDate: "01/01/2025", rules: "For vendor/client rentals" },
    { type: "Owner T&M Rate", amount: "$135/hr", effectiveDate: "01/01/2025", rules: "For owner-supplied equipment" },
  ]

  const issuesData = [
    {
      id: "ISS-789",
      severity: "Critical",
      description: "Cracked windshield",
      source: "Pre-Deploy Inspection",
      date: "11/08/2025",
      status: "Resolved",
      linkedWO: "WO-1245",
    },
    {
      id: "ISS-790",
      severity: "Major",
      description: "Hydraulic leak - left arm",
      source: "Telematics Alert",
      date: "11/10/2025",
      status: "In Progress",
      linkedWO: "WO-1246",
    },
    {
      id: "ISS-791",
      severity: "Minor",
      description: "Scratched paint on boom",
      source: "Operator Report",
      date: "11/11/2025",
      status: "Open",
      linkedWO: "—",
    },
  ]

  const jobHistoryData = [
    {
      project: "Metro Transit Project",
      dates: "11/08 - Present",
      days: "5 days / 40 hrs",
      rate: "$125/hr Internal",
      billing: "$5,000",
      costs: "$1,200",
      profit: "$3,800",
      utilization: "95%",
    },
    {
      project: "Bunge Grain Elevator",
      dates: "08/01 - 10/31",
      days: "92 days / 736 hrs",
      rate: "$125/hr Internal",
      billing: "$92,000",
      costs: "$18,500",
      profit: "$73,500",
      utilization: "88%",
    },
    {
      project: "Lake Charles Marine",
      dates: "06/15 - 07/30",
      days: "45 days / 360 hrs",
      rate: "$150/hr External",
      billing: "$54,000",
      costs: "$12,800",
      profit: "$41,200",
      utilization: "92%",
    },
    {
      project: "Southern Stone Quarry",
      dates: "04/01 - 05/31",
      days: "60 days / 480 hrs",
      rate: "$110/hr Internal",
      billing: "$52,800",
      costs: "$15,200",
      profit: "$37,600",
      utilization: "85%",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "Major":
        return "bg-orange-100 text-orange-800"
      case "Minor":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-11/12 max-w-5xl my-8 max-h-[90vh] overflow-y-auto z-50">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{equipment.id}</h2>
              <p className="text-muted-foreground">{equipment.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">{equipment.status}</Badge>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="bg-transparent">
              Edit
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent gap-2">
              <QrCode className="w-4 h-4" />
              Generate QR
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent gap-2">
              <History className="w-4 h-4" />
              View History
            </Button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto overflow-x-auto flex-wrap">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="rates"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Rate Card
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Assignment History
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Current Status
            </TabsTrigger>
            <TabsTrigger
              value="telematics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Telematics
            </TabsTrigger>
            <TabsTrigger
              value="gps"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              GPS & Weather
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Issues
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Job History
            </TabsTrigger>
            <TabsTrigger
              value="history_analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent whitespace-nowrap"
            >
              Equipment History
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Photo and Specs */}
              <div className="space-y-6">
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <img
                    src="/heavy-construction-equipment.jpg"
                    alt={equipment.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Make</p>
                      <p className="font-medium text-foreground">Caterpillar</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Model</p>
                      <p className="font-medium text-foreground">320</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year</p>
                      <p className="font-medium text-foreground">2022</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Serial #</p>
                      <p className="font-medium text-foreground">CAT320-2022</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium text-foreground">20 Tons</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Color</p>
                      <p className="font-medium text-foreground">Yellow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                {/* Ownership Details */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-3">Ownership Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground">Owned</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Date</span>
                      <span className="font-medium text-foreground">01/15/2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Price</span>
                      <span className="font-medium text-foreground">$285,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Warranty Exp</span>
                      <span className="font-medium text-foreground">01/15/2025</span>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-3">Current Status</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>Available
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">Yard A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Used</span>
                      <span className="font-medium text-foreground">11/08/2025</span>
                    </div>
                  </div>
                </div>

                {/* Compliance */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-3">Compliance</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance Exp</span>
                      <span className="font-medium text-foreground">12/31/2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DOT Inspection</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <span className="text-green-600">✓</span>03/15/2025
                      </span>
                    </div>
                  </div>
                </div>

                {/* Required Certifications */}
                <div>
                  <h5 className="font-semibold text-foreground mb-3">Operator Certifications</h5>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-blue-100 text-blue-800">CDL Class A</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Heavy Equipment Operator</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Rate Card Tab */}
          <TabsContent value="rates" className="p-6 space-y-6">
            {/* Rate Source Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Rate Source Selection</h3>
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rateSource"
                    checked={useTemplate}
                    onChange={() => setUseTemplate(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Use Template</span>
                  <select
                    disabled={!useTemplate}
                    className="border border-border rounded px-3 py-1 text-sm text-foreground ml-2 disabled:opacity-50"
                  >
                    <option>Heavy Equipment Standard Rates</option>
                    <option>Premium Equipment Rates</option>
                    <option>Budget Equipment Rates</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rateSource"
                    checked={!useTemplate}
                    onChange={() => setUseTemplate(false)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Custom Rates for This Equipment</span>
                </label>
              </div>
            </div>

            {/* Complete Rate Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Rate Configuration</h3>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rate Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Effective Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rate Rules</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateTableData.map((rate, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium text-foreground">{rate.type}</td>
                        <td className="py-3 px-4 font-medium text-accent">{rate.amount}</td>
                        <td className="py-3 px-4 text-muted-foreground">{rate.effectiveDate}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{rate.rules}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rate Application Rules Section */}
            <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandRules(!expandRules)}
              >
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">⚙️</span>
                  Automatic Rate Selection Rules
                </h4>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandRules ? "rotate-180" : ""}`} />
              </div>

              {expandRules && (
                <div className="space-y-4 mt-4 pt-4 border-t border-blue-200">
                  {/* Duration-Based Rules */}
                  <div>
                    <p className="font-medium text-foreground mb-2">Duration-Based Rules:</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          If assignment {"<"} 3 days → Apply <span className="font-semibold">Daily Rate</span>{" "}
                          ($800/day)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          If assignment 3-7 days → Apply <span className="font-semibold">Weekly Rate</span> ($4,200/wk)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          If assignment {">"} 7 days or {">"} 176 hours → Apply{" "}
                          <span className="font-semibold">Monthly Rate</span> ($15,000/mo)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>User can override during LOR approval</span>
                      </div>
                    </div>
                  </div>

                  {/* Rate Type Selection */}
                  <div>
                    <p className="font-medium text-foreground mb-2">Rate Type Selection by Project:</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          Internal projects (same BU) → Use <span className="font-semibold">Internal Rate</span>{" "}
                          ($110/hr)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          Cross-BU projects → Use <span className="font-semibold">External Rate</span> ($150/hr)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          Third-party rentals → Use <span className="font-semibold">External Rate</span> ($150/hr)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>
                          Owner-supplied equipment → Use <span className="font-semibold">Owner T&M Rate</span> ($135/hr)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Edit Rules
                </Button>
              </div>
            </div>

            {/* Update Rates Button */}
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                Update Rates
              </Button>
            </div>
          </TabsContent>

          {/* Assignment History Tab */}
          <TabsContent value="history" className="p-6 space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Assignment Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Days On-Rent (YTD)</p>
                  <p className="text-2xl font-bold text-foreground">95 days</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
                  <p className="text-2xl font-bold text-accent">$95,000</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Assignment</p>
                  <p className="text-2xl font-bold text-foreground">31 days</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Project</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Start Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">End Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Total Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">Metro Transit</td>
                    <td className="py-3 px-4 text-muted-foreground">Internal</td>
                    <td className="py-3 px-4 text-muted-foreground">11/08/2025</td>
                    <td className="py-3 px-4 text-muted-foreground">—</td>
                    <td className="py-3 px-4 text-muted-foreground">3 days</td>
                    <td className="py-3 px-4 font-medium text-accent">$3,000</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">Bunge Project</td>
                    <td className="py-3 px-4 text-muted-foreground">Internal</td>
                    <td className="py-3 px-4 text-muted-foreground">08/01/2025</td>
                    <td className="py-3 px-4 text-muted-foreground">10/31/2025</td>
                    <td className="py-3 px-4 text-muted-foreground">92 days</td>
                    <td className="py-3 px-4 font-medium text-accent">$92,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Current Status Tab */}
          <TabsContent value="status" className="p-6">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold text-green-700 mb-2">✓ Available for Deployment</p>
                <p className="text-sm text-green-600">Ready to be assigned to a new project</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold text-foreground">Yard A</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Last Inspection</p>
                  <p className="font-semibold text-foreground">11/01/2025 - Passed</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Engine Hours</p>
                  <p className="font-semibold text-foreground">1,250 hrs</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Fuel Level</p>
                  <p className="font-semibold text-foreground">75%</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Next Maintenance Due</p>
                <p className="font-semibold text-foreground">1,500 hrs (250 hrs remaining)</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-accent hover:bg-accent/90">Assign to Request</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Telematics Tab */}
          <TabsContent value="telematics" className="p-6 space-y-6">
            {/* Live Data Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Real-Time Status (Last updated: 2 minutes ago)
              </h3>

              {/* Current Location */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Current Location
                </h4>
                <div className="bg-white rounded-lg h-48 border border-border flex items-center justify-center">
                  <p className="text-muted-foreground">Map view: 1234 Project Site Rd, Baton Rouge, LA</p>
                </div>
                <p className="text-sm text-muted-foreground">30.4515°N, 91.1871°W</p>
              </div>

              {/* Engine Status Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-green-600 font-semibold">Engine Status</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">Running</p>
                  <p className="text-xs text-green-600 mt-1">Green indicator</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold">Engine Hours</p>
                  <p className="text-2xl font-bold text-foreground mt-1">1,250</p>
                  <p className="text-xs text-muted-foreground mt-1">cumulative</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold">Fuel Level</p>
                  <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                    <div className="bg-accent h-full rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <p className="text-sm font-bold text-foreground mt-2">75%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold">Battery</p>
                  <p className="text-2xl font-bold text-foreground mt-1">13.2V</p>
                  <p className="text-xs text-muted-foreground mt-1">Signal: Strong</p>
                </div>
              </div>

              <Button variant="outline" className="bg-transparent gap-2">
                Refresh Now
              </Button>
            </div>

            {/* Utilization Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Utilization Metrics</h3>
              <select className="border border-border rounded px-3 py-2 text-sm text-foreground">
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 30 Days</option>
              </select>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Hours</p>
                  <p className="text-2xl font-bold text-foreground mt-1">42.5</p>
                  <p className="text-xs text-muted-foreground">hrs (engine running + working)</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Idle Hours</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">8.2</p>
                  <p className="text-xs text-muted-foreground">hrs (engine on but not working)</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Utilization %</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">83.8%</p>
                  <p className="text-xs text-muted-foreground">active / total</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-3">Daily usage breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Mon: 8.2hrs</span>
                    <div className="flex-1 mx-3 bg-gray-300 rounded h-2">
                      <div className="bg-accent h-full rounded" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tue: 9.1hrs</span>
                    <div className="flex-1 mx-3 bg-gray-300 rounded h-2">
                      <div className="bg-accent h-full rounded" style={{ width: "91%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wed: 7.8hrs</span>
                    <div className="flex-1 mx-3 bg-gray-300 rounded h-2">
                      <div className="bg-accent h-full rounded" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Thu: 8.5hrs</span>
                    <div className="flex-1 mx-3 bg-gray-300 rounded h-2">
                      <div className="bg-accent h-full rounded" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fri: 8.9hrs</span>
                    <div className="flex-1 mx-3 bg-gray-300 rounded h-2">
                      <div className="bg-accent h-full rounded" style={{ width: "89%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fuel Consumption */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Fuel Consumption</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Fuel (This Week)</p>
                  <p className="text-2xl font-bold text-foreground mt-1">156</p>
                  <p className="text-xs text-muted-foreground">gallons</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-foreground mt-1">3.67</p>
                  <p className="text-xs text-muted-foreground">gal/hr</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="text-2xl font-bold text-accent mt-1">$468</p>
                  <p className="text-xs text-muted-foreground">@$3/gal</p>
                </div>
              </div>
            </div>

            {/* Diagnostic Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Diagnostic Alerts
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-yellow-900">Active Fault Codes: 1 Warning</h4>
                <div className="bg-white rounded p-3 space-y-2">
                  <p className="font-semibold text-foreground">P0420 - Catalyst System Efficiency Below Threshold</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Severity</p>
                      <p className="font-medium text-yellow-600">Warning (Yellow)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">First Detected</p>
                      <p className="font-medium">11/08/2025 2:30 PM</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium text-yellow-600">Active</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recommended</p>
                      <p className="font-medium">Schedule emission system inspection</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All Codes
                </Button>
              </div>
            </div>

            {/* Idle Time Analysis */}
            <div className="space-y-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground">Idle Time Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">This Week Idle</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">8.2 hrs</p>
                  <p className="text-xs text-muted-foreground">(16% of running time)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry Benchmark</p>
                  <p className="text-2xl font-bold text-foreground mt-1">&lt;10%</p>
                  <p className="text-xs text-muted-foreground">idle time</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost of Idle</p>
                  <p className="text-2xl font-bold text-accent mt-1">$82</p>
                  <p className="text-xs text-muted-foreground">wasted fuel</p>
                </div>
              </div>
              <div className="bg-white rounded p-3 space-y-2 text-sm">
                <p className="font-semibold text-foreground">Top Idle Causes:</p>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Warm-up periods:</span>
                    <span className="font-medium text-foreground">3.5 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waiting for materials:</span>
                    <span className="font-medium text-foreground">2.8 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator breaks:</span>
                    <span className="font-medium text-foreground">1.9 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* GPS & Weather Tab */}
          <TabsContent value="gps" className="p-6 space-y-6">
            {/* Live Equipment Map */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Current Location Map
              </h3>
              <div className="bg-muted rounded-lg h-96 border border-border flex items-center justify-center">
                <p className="text-muted-foreground">Map view showing EXC-001 at Bunge Project</p>
              </div>
            </div>

            {/* Location History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Location History</h3>
              <select className="border border-border rounded px-3 py-2 text-sm text-foreground">
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
              </select>
              <div className="space-y-3">
                {[
                  { site: "Bunge Project Site", dates: "Nov 8 - Present", duration: "5 days" },
                  { site: "In Transit", dates: "Nov 8", duration: "0.5 hrs, 12 miles" },
                  { site: "Yard A - Shop Bay 1", dates: "Nov 1-7", duration: "7 days - Maintenance" },
                  { site: "Lake Charles Marine", dates: "Oct 15 - Oct 31", duration: "16 days" },
                ].map((location, idx) => (
                  <div key={idx} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{location.site}</p>
                        <p className="text-sm text-muted-foreground">{location.dates}</p>
                      </div>
                      <Badge>{location.duration}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground">Total Miles (30 days)</p>
                  <p className="text-xl font-bold text-foreground">57 miles</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground">Total Sites</p>
                  <p className="text-xl font-bold text-foreground">3 locations</p>
                </div>
              </div>
            </div>

            {/* Project Geofences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Active Geofences</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Bunge Project Site</p>
                    <p className="text-sm text-muted-foreground">0.5 mile radius from 30.4515°N, 91.1871°W</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Inside</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-green-600">Equipment inside boundary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">11/08/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alerts</span>
                    <span className="font-medium">Notify if equipment leaves during off-hours (6PM-6AM)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Impact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Weather Impact Tracking
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-2xl">☀️</p>
                    <p className="font-bold text-foreground mt-1">22 days</p>
                    <p className="text-xs text-muted-foreground">Clear (73%)</p>
                  </div>
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
                    <p className="text-2xl">🌧️</p>
                    <p className="font-bold text-foreground mt-1">5 days</p>
                    <p className="text-xs text-muted-foreground">Rain (17%)</p>
                  </div>
                  <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 text-center">
                    <p className="text-2xl">⛈️</p>
                    <p className="font-bold text-foreground mt-1">3 days</p>
                    <p className="text-xs text-muted-foreground">Severe (10%)</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-foreground">Weather-Related Downtime</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Hours Lost</span>
                      <span className="font-medium text-foreground">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Cost Impact</span>
                      <span className="font-medium text-accent">$3,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Most Recent Weather Event</p>
                  <p className="text-sm text-muted-foreground mb-2">11/10/2025 - Thunderstorm Warning</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Action: Equipment secured, work stopped 2PM-5PM</p>
                    <p className="text-muted-foreground">Duration: 3 hours downtime</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Equipment Issues</h3>
              <Button size="sm" className="bg-accent hover:bg-accent/90 gap-2">
                <Plus className="w-4 h-4" />
                Report New Issue
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select className="border border-border rounded px-3 py-2 text-sm text-foreground">
                <option>All Issues</option>
              </select>
              <select className="border border-border rounded px-3 py-2 text-sm text-foreground">
                <option>All Severity</option>
              </select>
              <select className="border border-border rounded px-3 py-2 text-sm text-foreground">
                <option>All Status</option>
              </select>
            </div>

            {/* Issues Table */}
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Issue #</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Severity</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Reported</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Linked WO</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issuesData.map((issue) => (
                    <tr key={issue.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{issue.id}</td>
                      <td className="py-3 px-4">
                        <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                      </td>
                      <td className="py-3 px-4 text-foreground">{issue.description}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{issue.source}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{issue.date}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{issue.linkedWO}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => setSelectedIssue(issue)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Issue Detail Modal */}
            {selectedIssue && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <Card className="w-full max-w-2xl my-8">
                  <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedIssue.id}</h3>
                      <p className="text-muted-foreground">Equipment: {equipment.id}</p>
                    </div>
                    <button onClick={() => setSelectedIssue(null)} className="p-1 hover:bg-muted rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Description</p>
                        <p className="font-medium text-foreground mt-1">{selectedIssue.description}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground mt-1">Bunge Project Site</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Date/Time Discovered</p>
                        <p className="font-medium text-foreground mt-1">{selectedIssue.date} 2:45 PM</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Reported By</p>
                        <p className="font-medium text-foreground mt-1">{selectedIssue.source}</p>
                      </div>
                    </div>

                    {selectedIssue.linkedWO !== "—" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="font-semibold text-foreground mb-2">
                          Linked Work Order: {selectedIssue.linkedWO}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-foreground">In Progress</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Assigned To</span>
                            <span className="font-medium text-foreground">Mike Johnson</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Parts Cost</span>
                            <span className="font-medium text-accent">$760</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Labor Estimate</span>
                            <span className="font-medium text-foreground">6 hrs @ $85/hr = $510</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button className="flex-1 bg-accent hover:bg-accent/90">Update Status</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Create Work Order
                      </Button>
                      <Button variant="outline" className="bg-transparent" onClick={() => setSelectedIssue(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Job History Tab */}
          <TabsContent value="jobs" className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground mt-1">24</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-accent mt-1">$285,000</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground mt-1">2,100</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Average Profit Margin</p>
                <p className="text-2xl font-bold text-green-600 mt-1">79.9%</p>
              </div>
            </div>

            {/* Job History Table */}
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Project</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Dates</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Billing</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Costs</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Profit</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistoryData.map((job, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 cursor-pointer">
                      <td className="py-3 px-4 font-medium text-foreground">{job.project}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{job.dates}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{job.days}</td>
                      <td className="py-3 px-4 font-medium text-accent">{job.billing}</td>
                      <td className="py-3 px-4 text-foreground">{job.costs}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{job.profit}</td>
                      <td className="py-3 px-4 text-foreground">{job.utilization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lifetime Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Lifetime Equipment Performance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Days On-Rent</p>
                  <p className="text-lg font-bold text-foreground mt-1">890 days</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Hours Worked</p>
                  <p className="text-lg font-bold text-foreground mt-1">7,120 hrs</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Net Profit</p>
                  <p className="text-lg font-bold text-green-600 mt-1">$623,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ROI</p>
                  <p className="text-lg font-bold text-green-600 mt-1">218%</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Equipment History Tab - FINAL MASTER TAB */}
          <TabsContent value="history_analytics" className="p-6 space-y-6">
            {/* Financial Summary Banner */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-700 font-semibold">Total Revenue</p>
                <p className="text-3xl font-bold text-green-800 mt-2">$890,000</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                <p className="text-xs text-red-700 font-semibold">Total Cost</p>
                <p className="text-3xl font-bold text-red-800 mt-2">$552,000</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700 font-semibold">Net Profit</p>
                <p className="text-3xl font-bold text-blue-800 mt-2">$338,000</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <p className="text-xs text-purple-700 font-semibold">ROI</p>
                <p className="text-3xl font-bold text-purple-800 mt-2">118.6%</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Payback Period</p>
                <p className="text-xl font-bold text-foreground mt-2">2.8 years</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Years in Service</p>
                <p className="text-xl font-bold text-foreground mt-2">3.2 years</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Purchase Date</p>
                <p className="text-sm font-bold text-foreground mt-2">01/15/2022</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Purchase Price</p>
                <p className="text-xl font-bold text-foreground mt-2">$285K</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="text-xl font-bold text-foreground mt-2">8,100 hrs</p>
              </div>
            </div>

            {/* Utilization & Maintenance Summary */}
            <div className="grid grid-cols-2 gap-6">
              {/* Utilization */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Utilization Summary</h4>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Hours Worked</span>
                    <span className="text-lg font-bold text-foreground">7,120 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Engine Hours</span>
                    <span className="text-lg font-bold text-foreground">8,100 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Projects</span>
                    <span className="text-lg font-bold text-foreground">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Utilization</span>
                    <span className="text-lg font-bold text-green-600">87.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Idle Time</span>
                    <span className="text-lg font-bold text-yellow-600">12.1%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg h-32 border border-border flex items-center justify-center text-sm text-muted-foreground">
                  Utilization Trend Chart (24 months)
                </div>
              </div>

              {/* Maintenance */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Maintenance Summary</h4>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Maintenance Cost</span>
                    <span className="text-lg font-bold text-foreground">$45,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Work Orders</span>
                    <span className="text-lg font-bold text-foreground">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Preventive (67%)</span>
                    <span className="text-lg font-bold text-blue-600">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Corrective (33%)</span>
                    <span className="text-lg font-bold text-red-600">16</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">MTBF</span>
                    <span className="text-lg font-bold text-foreground">222 hrs</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg h-32 border border-border flex items-center justify-center text-sm text-muted-foreground">
                  Maintenance Cost Trend
                </div>
              </div>
            </div>

            {/* Top Recurring Issues */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Top 5 Recurring Issues</h4>
              <div className="space-y-2">
                {[
                  { issue: "Hydraulic seal replacement", count: 8, cost: "$6,400" },
                  { issue: "Track adjustment", count: 6, cost: "$1,920" },
                  { issue: "Oil change (PM)", count: 32, cost: "$14,400" },
                  { issue: "Air filter replacement (PM)", count: 16, cost: "$2,560" },
                  { issue: "Battery replacement", count: 2, cost: "$800" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-muted/50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.issue}</p>
                      <p className="text-xs text-muted-foreground">{item.count} times</p>
                    </div>
                    <p className="font-semibold text-accent">{item.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Decision Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">AI-Powered Lifecycle Analysis</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="font-semibold text-green-900">Recommendation: KEEP OPERATING</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Equipment is highly profitable (118% ROI exceeds target of 50%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Utilization rate 87.9% exceeds industry benchmark (75% target)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Maintenance costs stable and predictable</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>No major repairs in last 6 months - equipment performing well</span>
                  </div>
                </div>
                <p className="text-sm text-green-800 font-medium mt-3">Projected Remaining Life: 4-6 years</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                <p className="font-semibold text-yellow-900">Metrics to Monitor</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Maintenance cost trending</span>
                    <span className="font-bold text-yellow-700">+15% YoY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Engine hours to next major service</span>
                    <span className="font-bold text-yellow-700">~1,500 hrs (18 months)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Hydraulic system wear level</span>
                    <span className="font-bold text-yellow-700">Increasing</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold text-foreground mb-3">Alternative Options at Decision Point (10,000 hrs)</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-foreground">Trade In (Est. value)</span>
                    <span className="font-bold text-foreground">$180,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-foreground">Sell (Market value)</span>
                    <span className="font-bold text-foreground">$195,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-foreground">Auction (Est. value)</span>
                    <span className="font-bold text-foreground">$170,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-accent/10 rounded border border-accent">
                    <span className="text-foreground font-semibold">Keep & Maintain (RECOMMENDED)</span>
                    <span className="font-bold text-accent">Continue operations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Per Hour Analysis */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Cost Per Hour Trend Analysis</h4>
              <div className="space-y-3">
                {[
                  { year: "Year 1 (2022)", cost: "$68.20/hr", status: "Breaking in" },
                  { year: "Year 2 (2023)", cost: "$54.30/hr", status: "Optimal performance" },
                  { year: "Year 3 (2024)", cost: "$58.75/hr", status: "Maintenance costs rising" },
                  { year: "Year 4 (2025 YTD)", cost: "$62.10/hr", status: "Aging equipment" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.year}</p>
                      <p className="text-xs text-muted-foreground">{item.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{item.cost}</p>
                      <div className="w-32 bg-gray-300 rounded-full h-2 mt-1">
                        <div className="bg-accent h-full rounded-full" style={{ width: `${idx * 25 + 25}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Target: &lt;$70/hr</span> |
                  <span className="ml-2">Current: $62.10/hr ✓ Within Target</span> |
                  <span className="ml-2">Projected (12m): $65-70/hr ✓ Acceptable</span>
                </p>
              </div>
            </div>

            {/* Export Report */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button className="flex-1 bg-accent hover:bg-accent/90">Generate Lifecycle Report</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Export Analysis PDF
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
