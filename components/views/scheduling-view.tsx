"use client"

import GanttChart from "@/components/gantt-chart"
import EquipmentDetail from "@/components/equipment-detail"
import RequestForm from "@/components/request-form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Download, ChevronDown, X } from "lucide-react"

const filterOptions = [
  { id: "available", label: "Show Available", default: true },
  { id: "onrent", label: "Show On Rent", default: true },
  { id: "maintenance", label: "Show Maintenance", default: true },
  { id: "outofservice", label: "Show Out of Service", default: true },
]

const pendingRequests = [
  {
    id: "REQ-004",
    equipment: "Mobile Crane 50T",
    dateRange: "Nov 22 - Dec 5",
    project: "Skyscraper Dev",
    urgency: "Routine",
  },
  {
    id: "REQ-007",
    equipment: "Excavator 20T",
    dateRange: "Nov 15 - Nov 30",
    project: "Bridge Project",
    urgency: "Urgent",
  },
  {
    id: "REQ-009",
    equipment: "Dump Truck 15T",
    dateRange: "Nov 12 - Nov 20",
    project: "Road Construction",
    urgency: "Critical",
  },
]

export default function SchedulingView() {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<"week" | "month" | "quarter">("month")
  const [dateRange, setDateRange] = useState("Nov 2025 - Jan 2026")
  const [viewMode, setViewMode] = useState<"equipment" | "operator" | "combined">("equipment")
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    available: true,
    onrent: true,
    maintenance: true,
    outofservice: true,
  })
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    excavators: true,
    dozers: true,
    trucks: true,
    generators: true,
    cranes: true,
  })
  const [showPendingRequests, setShowPendingRequests] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }))
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Controls */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Equipment Scheduling</h2>
            <p className="text-sm text-muted-foreground">{dateRange}</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select className="border border-border rounded px-3 py-1.5 text-sm text-foreground bg-background">
              <option>Nov 2025 - Jan 2026</option>
              <option>Oct 2025 - Dec 2025</option>
              <option>Dec 2025 - Feb 2026</option>
            </select>

            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {["week", "month", "quarter"].map((level) => (
                <button
                  key={level}
                  onClick={() => setZoomLevel(level as "week" | "month" | "quarter")}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    zoomLevel === level ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex gap-4 border-b border-border pb-4">
          {["equipment", "operator", "combined"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as "equipment" | "operator" | "combined")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "equipment" && "Equipment View"}
              {mode === "operator" && "Operator View"}
              {mode === "combined" && "Combined View"}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-border bg-card px-6 py-3 flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-muted-foreground">Status Filters:</span>
        {filterOptions.map((filter) => (
          <label key={filter.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters[filter.id]}
              onChange={() => toggleFilter(filter.id)}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm text-foreground">{filter.label}</span>
          </label>
        ))}
      </div>

      {/* Main Gantt Area with Pending Requests */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {showPendingRequests && (
          <div className="w-64 bg-card rounded-lg border border-border overflow-hidden flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Pending Requests</h3>
              <button
                onClick={() => setShowPendingRequests(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 p-3">
              {pendingRequests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRequest?.id === req.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50 hover:bg-muted/30"
                  }`}
                >
                  <p className="font-medium text-sm text-foreground">{req.id}</p>
                  <p className="text-xs text-foreground">{req.equipment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{req.dateRange}</p>
                  <p className="text-xs text-muted-foreground">{req.project}</p>
                  <Button
                    size="sm"
                    className="w-full mt-2 text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    Check Availability
                  </Button>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <Button variant="outline" size="sm" className="w-full bg-transparent text-xs">
                View All Requests →
              </Button>
            </div>
          </div>
        )}

        {!showPendingRequests && (
          <Button
            onClick={() => setShowPendingRequests(true)}
            size="sm"
            className="absolute left-4 top-[320px] bg-accent text-white"
          >
            Show Requests
          </Button>
        )}

        {/* Left Sidebar - Equipment List */}
        <div className="w-64 bg-card rounded-lg border border-border overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Equipment List</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {[
              { id: "excavators", label: "Excavators", count: 5 },
              { id: "dozers", label: "Dozers", count: 3 },
              { id: "trucks", label: "Dump Trucks", count: 4 },
              { id: "generators", label: "Generators", count: 2 },
              { id: "cranes", label: "Cranes", count: 2 },
            ].map((group) => (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedGroups[group.id] ? "" : "-rotate-90"}`}
                  />
                  <span className="text-sm font-medium text-foreground">{group.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">({group.count})</span>
                </button>

                {expandedGroups[group.id] && (
                  <div className="ml-6 space-y-1">
                    {["001", "002", "003", "004", "005"].map((num, idx) => {
                      if (idx >= group.count) return null
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedEquipment(`${group.id.slice(0, 3).toUpperCase()}-${num}`)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                            selectedEquipment === `${group.id.slice(0, 3).toUpperCase()}-${num}`
                              ? "bg-accent text-white"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {group.id.slice(0, 3).toUpperCase()}-{num}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Gantt Chart */}
        <div className="flex-1 overflow-hidden">
          <GanttChart selectedEquipment={selectedEquipment} onSelectEquipment={setSelectedEquipment} />
        </div>

        {/* Right Sidebar - Equipment Detail */}
        {selectedEquipment && (
          <EquipmentDetail equipmentId={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
        )}
      </div>

      {showRequestForm && <RequestForm onClose={() => setShowRequestForm(false)} />}
    </div>
  )
}
