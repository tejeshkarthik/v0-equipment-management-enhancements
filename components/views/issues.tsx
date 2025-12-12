"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const issuesData = [
  {
    id: "ISS-790",
    severity: "critical",
    equipment: "EXC-001",
    title: "Hydraulic leak - left arm",
    source: "Telematics",
    date: "11/10/25",
    status: "wo-progress",
    wo: "WO-1246",
  },
  {
    id: "ISS-789",
    severity: "critical",
    equipment: "CR-003",
    title: "Cracked windshield",
    source: "Pre-Deploy",
    date: "11/08/25",
    status: "resolved",
    wo: "WO-1245",
  },
  {
    id: "ISS-791",
    severity: "major",
    equipment: "DOZ-002",
    title: "Engine overheating warning",
    source: "Telematics",
    date: "11/11/25",
    status: "wo-parts",
    wo: "WO-1248",
  },
  {
    id: "ISS-792",
    severity: "moderate",
    equipment: "DT-001",
    title: "Tire pressure low - right rear",
    source: "Daily Inspect",
    date: "11/12/25",
    status: "open",
    wo: null,
  },
  {
    id: "ISS-793",
    severity: "minor",
    equipment: "GEN-001",
    title: "Scratched paint on housing",
    source: "Operator Report",
    date: "11/09/25",
    status: "open",
    wo: null,
  },
  {
    id: "ISS-794",
    severity: "major",
    equipment: "EXC-003",
    title: "Fuel consumption abnormal",
    source: "Telematics",
    date: "11/10/25",
    status: "investigating",
    wo: null,
  },
  {
    id: "ISS-795",
    severity: "critical",
    equipment: "CR-001",
    title: "Boom hydraulics failing",
    source: "Operator Report",
    date: "11/12/25",
    status: "urgent",
    wo: "WO-1252",
  },
]

const severityColors = {
  critical: "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-200",
  major: "text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-200",
  moderate: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-200",
  minor: "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-200",
}

const severityIcons = {
  critical: "🔴",
  major: "🟠",
  moderate: "🟡",
  minor: "🟢",
}

const statusLabels = {
  open: "🔵 Open",
  investigating: "🟠 Under Investigation",
  "wo-progress": "🟡 WO In Progress",
  "wo-parts": "🟡 WO Awaiting Parts",
  resolved: "✅ Resolved",
  urgent: "🔴 Urgent - Equip Down",
}

export default function Issues() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<(typeof issuesData)[0] | null>(null)

  const severityCounts = {
    critical: issuesData.filter((i) => i.severity === "critical").length,
    major: issuesData.filter((i) => i.severity === "major").length,
    moderate: issuesData.filter((i) => i.severity === "moderate").length,
    minor: issuesData.filter((i) => i.severity === "minor").length,
  }

  const filteredIssues = selectedSeverity ? issuesData.filter((i) => i.severity === selectedSeverity) : issuesData

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipment Issues</h1>
          <p className="text-muted-foreground mt-1">Track all equipment problems, defects, and concerns</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">+ Report Issue</Button>
      </div>

      {/* Severity Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["critical", "major", "moderate", "minor"] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(selectedSeverity === sev ? null : sev)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedSeverity === sev ? severityColors[sev] : "border border-border hover:bg-muted text-foreground"
            }`}
          >
            {severityIcons[sev]} {sev.charAt(0).toUpperCase() + sev.slice(1)} ({severityCounts[sev]})
          </button>
        ))}
      </div>

      {/* Top Controls */}
      <div className="flex gap-2 flex-wrap">
        <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
          <option>Source: All</option>
          <option>Telematics Alert</option>
          <option>Pre-Deploy Inspection</option>
          <option>Daily Inspection</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
          <option>Status: All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border border-border rounded-lg text-sm flex-1 max-w-sm"
        />
      </div>

      {/* Issues Table */}
      <Card className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Issue</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Severity</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Equipment</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Description</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Source</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Reported</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 font-semibold text-accent">{issue.id}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${severityColors[issue.severity]}`}>
                    {severityIcons[issue.severity]} {issue.severity}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-foreground">{issue.equipment}</td>
                <td className="py-3 px-4 text-muted-foreground">{issue.title}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{issue.source}</td>
                <td className="py-3 px-4 text-muted-foreground">{issue.date}</td>
                <td className="py-3 px-4">
                  <span className="text-xs">{statusLabels[issue.status as keyof typeof statusLabels]}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-accent hover:underline font-medium text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">Issue #{selectedIssue.id}</h2>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${severityColors[selectedIssue.severity]}`}
                    >
                      {severityIcons[selectedIssue.severity]} {selectedIssue.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Equipment: {selectedIssue.equipment}</p>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="text-2xl text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm font-medium text-foreground">{selectedIssue.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="font-semibold text-foreground">{selectedIssue.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reported</p>
                    <p className="font-semibold text-foreground">{selectedIssue.date}</p>
                  </div>
                </div>
              </div>

              {selectedIssue.wo && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Linked Work Order</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {statusLabels[selectedIssue.status as keyof typeof statusLabels]} - {selectedIssue.wo}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Equipment Downtime</p>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>11/10/2025 2:45 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>50 hours</span>
                  </div>
                  <div className="flex justify-between font-semibold text-red-600">
                    <span>Revenue Loss:</span>
                    <span>$6,250</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">Timeline</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>✓ 11/10/25 2:45 PM - Issue detected</div>
                  <div>✓ 11/10/25 4:00 PM - Work Order created</div>
                  <div>⏳ 11/12/25 9:00 AM - Repair in progress</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-accent hover:bg-accent/90">Create Work Order</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedIssue(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
