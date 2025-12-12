"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const workOrderData = {
  open: [
    {
      id: "WO-1246",
      equipment: "EXC-001",
      title: "Hydraulic Leak",
      priority: "high",
      daysUntil: 1,
      cost: 1270,
      source: "Telematics Alert",
    },
    {
      id: "WO-1247",
      equipment: "EXC-003",
      title: "Track Adjustment",
      priority: "medium",
      daysUntil: 3,
      cost: 450,
      source: "Inspection",
    },
  ],
  inProgress: [
    {
      id: "WO-1245",
      equipment: "CR-003",
      title: "Windshield Replace",
      priority: "medium",
      daysUntil: 2,
      cost: 350,
      source: "Pre-Deploy",
    },
    {
      id: "WO-1250",
      equipment: "GEN-001",
      title: "PM Service",
      priority: "low",
      daysUntil: 1,
      cost: 750,
      source: "Schedule",
    },
  ],
  awaitingParts: [
    {
      id: "WO-1248",
      equipment: "DOZ-002",
      title: "Engine Overhaul",
      priority: "low",
      daysUntil: 8,
      cost: 3200,
      source: "Issue ISS-791",
    },
    {
      id: "WO-1251",
      equipment: "DT-001",
      title: "Brake Repair",
      priority: "medium",
      daysUntil: 6,
      cost: 850,
      source: "Inspection",
    },
  ],
  completed: [{ id: "WO-1244", equipment: "EXC-002", title: "Oil Change", cost: 480, completedDate: "11/10/2025" }],
}

const priorityColors = {
  high: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200",
  medium: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200",
  low: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200",
}

const priorityIcons = {
  high: "🔴",
  medium: "🟡",
  low: "🟢",
}

export default function WorkOrders() {
  const [selectedTab, setSelectedTab] = useState<"open" | "inProgress" | "awaitingParts" | "completed">("open")
  const [selectedWO, setSelectedWO] = useState<any>(null)

  const tabCounts = {
    open: workOrderData.open.length,
    inProgress: workOrderData.inProgress.length,
    awaitingParts: workOrderData.awaitingParts.length,
    completed: 156,
  }

  const currentOrders = workOrderData[selectedTab]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground mt-1">Track maintenance, repairs, and service requests</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">+ New Work Order</Button>
      </div>

      {/* Top Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
          <option>Priority: All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
          <option>Type: All</option>
          <option>Preventive Maintenance</option>
          <option>Corrective Repair</option>
          <option>Breakdown</option>
        </select>
        <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
          <option>Assigned To: All</option>
          <option>Mike Johnson</option>
          <option>John Smith</option>
        </select>
        <input type="text" placeholder="Search..." className="px-3 py-2 border border-border rounded-lg text-sm" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(["open", "inProgress", "awaitingParts", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "open" && `Open (${tabCounts.open})`}
            {tab === "inProgress" && `In Progress (${tabCounts.inProgress})`}
            {tab === "awaitingParts" && `Awaiting Parts (${tabCounts.awaitingParts})`}
            {tab === "completed" && `Completed (${tabCounts.completed})`}
          </button>
        ))}
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentOrders.map((wo) => (
          <Card
            key={wo.id}
            onClick={() => setSelectedWO(wo)}
            className="p-4 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="font-semibold text-foreground">{wo.id}</div>
              {wo.priority && (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[wo.priority]}`}>
                  {priorityIcons[wo.priority]} {wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1)}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground font-medium mb-2">{wo.title}</p>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <p>📦 {wo.equipment}</p>
              {wo.source && <p>📌 {wo.source}</p>}
              {wo.completedDate && <p>✅ Completed: {wo.completedDate}</p>}
              {wo.daysUntil && <p>📅 Due in {wo.daysUntil} days</p>}
            </div>
            {wo.cost && <p className="text-sm font-semibold text-accent">💰 ${wo.cost}</p>}
            <Button size="sm" className="w-full mt-3 text-xs">
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {/* Work Order Detail Modal */}
      {selectedWO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Work Order #{selectedWO.id}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Equipment: {selectedWO.equipment}</p>
                </div>
                <button onClick={() => setSelectedWO(null)} className="text-2xl text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedWO.priority && (
                <div className={`p-4 rounded-lg ${priorityColors[selectedWO.priority]}`}>
                  <p className="font-semibold">
                    {priorityIcons[selectedWO.priority]} {selectedWO.priority.toUpperCase()} PRIORITY
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground">Corrective Repair</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-semibold text-foreground">11/10/2025</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-semibold text-foreground">11/12/2025</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="font-semibold text-foreground">Mike Johnson</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Description</p>
                <p className="text-sm text-muted-foreground">{selectedWO.title} - Linked to Issue #ISS-790</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Parts Required</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Seal Kit (CAT-HYD-320)</span>
                    <span>$450</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Hydraulic Fluid 68 (15L)</span>
                    <span>$180</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Filter (HYD)</span>
                    <span>$130</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Labor</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mike Johnson - 6 hrs @ $85/hr</span>
                  <span className="font-semibold">$510</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Total Cost Estimate</p>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Parts:</span>
                    <span>$760</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor:</span>
                    <span>$510</span>
                  </div>
                  <div className="border-t border-blue-300 dark:border-blue-700 my-2"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${selectedWO.cost || 1270}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-accent hover:bg-accent/90">Start Work</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedWO(null)}>
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
