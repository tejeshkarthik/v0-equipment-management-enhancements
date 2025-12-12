"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import InspectionDetailModal from "@/components/inspection-detail-modal"

const inspectionList = [
  {
    id: "INS-101",
    equipment: "EXC-001",
    type: "Pre-Deployment",
    status: "Passed",
    inspector: "John Doe",
    date: "2025-11-11",
  },
  {
    id: "INS-102",
    equipment: "DOZ-005",
    type: "Daily Field Check",
    status: "Passed",
    inspector: "John Smith",
    date: "2025-11-10",
  },
  {
    id: "INS-103",
    equipment: "DT-010",
    type: "PM Inspection",
    status: "Failed",
    inspector: "Jane Smith",
    date: "2025-11-09",
  },
  {
    id: "INS-104",
    equipment: "GEN-002",
    type: "Pre-Deployment",
    status: "Passed",
    inspector: "Mike Chen",
    date: "2025-11-09",
  },
  {
    id: "INS-105",
    equipment: "CR-001",
    type: "Daily Field Check",
    status: "In Progress",
    inspector: "Sarah Johnson",
    date: "2025-11-11",
  },
  {
    id: "INS-106",
    equipment: "EXC-002",
    type: "PM Inspection",
    status: "Pending",
    inspector: "—",
    date: "2025-11-13",
  },
]

const pendingPreDeploymentInspections = [
  {
    id: "INS-PRED-01",
    equipment: "CR-003",
    type: "Mobile Crane 50T",
    project: "REQ-004 - Skyscraper Development",
    deploymentDate: "Nov 22, 2025",
    daysUntilDeployment: 10,
    priority: "🟡 Medium",
    assignedTo: "Shop Team",
  },
  {
    id: "INS-PRED-02",
    equipment: "EXC-005",
    type: "Komatsu PC200",
    project: "REQ-007 - Bridge Project",
    deploymentDate: "Nov 15, 2025",
    daysUntilDeployment: 3,
    priority: "🔴 Urgent",
    assignedTo: "Shop Team",
  },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Passed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
  }
  return <Badge className={colors[status]}>{status}</Badge>
}

export default function FieldInspections() {
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [showPreDeploymentModal, setShowPreDeploymentModal] = useState(false)
  const [selectedPreDeploymentInspection, setSelectedPreDeploymentInspection] = useState<any>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Field Inspections</h2>
          <p className="text-sm text-muted-foreground">Manage equipment inspections and compliance</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          New Inspection
        </Button>
      </div>

      {pendingPreDeploymentInspections.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">
              Pending Pre-Deployment Inspections ({pendingPreDeploymentInspections.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPreDeploymentInspections.map((inspection) => (
              <Card key={inspection.id} className="p-4 bg-white border-yellow-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {inspection.equipment} - {inspection.type}
                    </p>
                    <p className="text-sm text-muted-foreground">For: {inspection.project}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{inspection.priority}</Badge>
                </div>

                <div className="space-y-1 my-3 text-sm text-muted-foreground">
                  <p>
                    Deployment Date: {inspection.deploymentDate} ({inspection.daysUntilDeployment} days)
                  </p>
                  <p>Assigned To: {inspection.assignedTo}</p>
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedPreDeploymentInspection(inspection)
                    setShowPreDeploymentModal(true)
                  }}
                >
                  Complete Inspection
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "calendar"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "list"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          List View
        </button>
      </div>

      {/* Calendar View */}
      {activeTab === "calendar" && (
        <Card className="p-6">
          <div className="max-w-sm">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-foreground">Inspections on {selectedDate?.toLocaleDateString()}</h3>
            <div className="space-y-2">
              {inspectionList
                .filter((ins) => ins.date === selectedDate?.toISOString().split("T")[0])
                .map((ins) => (
                  <button
                    key={ins.id}
                    onClick={() => setSelectedInspection(ins)}
                    className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {ins.equipment} - {ins.type}
                      </p>
                      <p className="text-sm text-muted-foreground">{ins.inspector}</p>
                    </div>
                    <StatusBadge status={ins.status} />
                  </button>
                ))}
              {inspectionList.filter((ins) => ins.date === selectedDate?.toISOString().split("T")[0]).length === 0 && (
                <p className="text-muted-foreground text-sm">No inspections scheduled</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* List View */}
      {activeTab === "list" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Inspection ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Equipment</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Inspector</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inspectionList.map((inspection) => (
                  <tr key={inspection.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{inspection.id}</td>
                    <td className="py-3 px-4 text-foreground">{inspection.equipment}</td>
                    <td className="py-3 px-4 text-muted-foreground">{inspection.type}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inspection.status} />
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{inspection.inspector}</td>
                    <td className="py-3 px-4 text-muted-foreground">{inspection.date}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInspection(inspection)}
                        className="bg-transparent"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedInspection && (
        <InspectionDetailModal inspection={selectedInspection} onClose={() => setSelectedInspection(null)} />
      )}

      {showPreDeploymentModal && selectedPreDeploymentInspection && (
        <PreDeploymentInspectionModal
          inspection={selectedPreDeploymentInspection}
          onClose={() => setShowPreDeploymentModal(false)}
        />
      )}
    </div>
  )
}

function PreDeploymentInspectionModal({ inspection, onClose }: { inspection: any; onClose: () => void }) {
  const [inspectionItems, setInspectionItems] = useState([
    { id: 1, name: "Engine oil level adequate", status: "pass", notes: "" },
    { id: 2, name: "Hydraulic fluid level adequate", status: "pass", notes: "" },
    { id: 3, name: "No fluid leaks visible", status: "pass", notes: "" },
    { id: 4, name: "Tracks/tires in good condition", status: "pass", notes: "" },
    { id: 5, name: "Bucket/attachment secure", status: "pass", notes: "" },
    { id: 6, name: "Safety devices functional", status: "pass", notes: "" },
    { id: 7, name: "Fire extinguisher present", status: "pass", notes: "" },
    { id: 8, name: "Windshield condition", status: "fail", notes: "Cracked windshield - driver side" },
  ])

  const [overallCondition, setOverallCondition] = useState("Excellent")
  const [hours, setHours] = useState("1250")
  const [fuel, setFuel] = useState(75)

  const failedItems = inspectionItems.filter((item) => item.status === "fail")
  const allPassed = failedItems.length === 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold text-foreground">Pre-Deployment Inspection</h2>
          <p className="text-sm text-muted-foreground">
            {inspection.equipment} - {inspection.type}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Inspection Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Inspector</p>
                <p className="font-medium text-foreground">Current User</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date/Time</p>
                <p className="font-medium text-foreground">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Equipment Hours</p>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-2 py-1 border border-border rounded"
                />
              </div>
              <div>
                <p className="text-muted-foreground">Fuel Level</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuel}
                  onChange={(e) => setFuel(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-foreground">{fuel}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Inspection Checklist</h3>
            {inspectionItems.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className={item.status === "pass" ? "text-green-600" : "text-red-600"}>
                    {item.status === "pass" ? "✅" : "❌"}
                  </span>
                  <span className="flex-1 text-sm">{item.name}</span>
                </div>
                {item.notes && <p className="text-xs text-muted-foreground mt-2 ml-6">{item.notes}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Overall Condition</label>
            <select
              value={overallCondition}
              onChange={(e) => setOverallCondition(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Attention</option>
            </select>
          </div>

          {!allPassed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900">❌ Inspection Failed - Issues Found:</p>
              <ul className="mt-2 space-y-1">
                {failedItems.map((item) => (
                  <li key={item.id} className="text-sm text-red-800">
                    • {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {allPassed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900">✅ Inspection Passed - Equipment approved for deployment</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90">
              {allPassed ? "Confirm Inspection Passed" : "Save Failed Inspection"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
