"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface ScheduleBar {
  id: string
  type: "available" | "assigned" | "maintenance"
  startDate: Date
  endDate: Date
  label: string
  project?: string
  operator?: string
  rate?: string
  estimatedCost?: string
}

interface Equipment {
  id: string
  name: string
  type: string
  schedule: ScheduleBar[]
  bu: string
}

const EQUIPMENT_DATA: Equipment[] = [
  {
    id: "exc-19730",
    name: "Excavator #19730",
    type: "Excavators",
    bu: "Corporate",
    schedule: [
      {
        id: "s1",
        type: "assigned",
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2025, 10, 30),
        label: "Bunge Project",
        project: "Bunge Grain Elevator",
        operator: "Alonso Palacios",
        rate: "$125/hr (Hourly)",
        estimatedCost: "$24,000",
      },
      {
        id: "s2",
        type: "available",
        startDate: new Date(2025, 11, 1),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "exc-19731",
    name: "Excavator #19731",
    type: "Excavators",
    bu: "Corporate",
    schedule: [
      {
        id: "s3",
        type: "maintenance",
        startDate: new Date(2025, 10, 15),
        endDate: new Date(2025, 10, 20),
        label: "Maintenance",
        project: "250-Hour Oil Change",
      },
      {
        id: "s4",
        type: "available",
        startDate: new Date(2025, 10, 21),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "exc-19732",
    name: "Excavator #19732",
    type: "Excavators",
    bu: "Southwest",
    schedule: [
      {
        id: "s5",
        type: "available",
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "doz-125",
    name: "Dozer #DOZ-125",
    type: "Dozers",
    bu: "Corporate",
    schedule: [
      {
        id: "s6",
        type: "available",
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "doz-126",
    name: "Dozer #DOZ-126",
    type: "Dozers",
    bu: "Southeast",
    schedule: [
      {
        id: "s7",
        type: "assigned",
        startDate: new Date(2025, 10, 10),
        endDate: new Date(2025, 11, 5),
        label: "Southern Stone",
        project: "Southern Stone Quarry Project",
        operator: "James Wilson",
        rate: "$150/hr (Hourly)",
        estimatedCost: "$18,000",
      },
      {
        id: "s8",
        type: "available",
        startDate: new Date(2025, 11, 6),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "truck-01",
    name: "Dump Truck #01",
    type: "Dump Trucks",
    bu: "Corporate",
    schedule: [
      {
        id: "s9",
        type: "assigned",
        startDate: new Date(2025, 11, 1),
        endDate: new Date(2025, 11, 10),
        label: "Lake Charles",
        project: "Lake Charles Marine Terminal",
        operator: "Emma Davis",
        rate: "$95/hr (Hourly)",
        estimatedCost: "$7,600",
      },
      {
        id: "s10",
        type: "available",
        startDate: new Date(2025, 11, 11),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "truck-02",
    name: "Dump Truck #02",
    type: "Dump Trucks",
    bu: "Southwest",
    schedule: [
      {
        id: "s11",
        type: "available",
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
  {
    id: "gen-01",
    name: "Generator #GEN-001",
    type: "Generators",
    bu: "Corporate",
    schedule: [
      {
        id: "s12",
        type: "available",
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2026, 0, 31),
        label: "Available",
      },
    ],
  },
]

const MONTH_LABELS = ["Nov 2025", "Dec 2025", "Jan 2026"]
const PIXELS_PER_DAY = 8

interface GanttChartProps {
  selectedEquipment: string | null
  onSelectEquipment: (id: string | null) => void
}

function ScheduleTooltip({ bar, equipment }: { bar: ScheduleBar; equipment: Equipment }) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  if (bar.type === "assigned") {
    return (
      <div className="bg-slate-900 text-white rounded-lg p-3 shadow-lg text-xs max-w-xs z-50">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          On Rent
        </p>
        <div className="space-y-1 text-slate-200">
          <p>
            <span className="text-slate-400">Project:</span> {bar.project}
          </p>
          <p>
            <span className="text-slate-400">Dates:</span> {formatDate(bar.startDate)} - {formatDate(bar.endDate)}
          </p>
          <p>
            <span className="text-slate-400">Duration:</span>{" "}
            {Math.ceil((bar.endDate.getTime() - bar.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
          {bar.operator && (
            <p>
              <span className="text-slate-400">Operator:</span> {bar.operator}
            </p>
          )}
          {bar.rate && (
            <p>
              <span className="text-slate-400">Rate:</span> {bar.rate}
            </p>
          )}
          {bar.estimatedCost && (
            <p>
              <span className="text-slate-400">Est. Total:</span>{" "}
              <span className="text-green-400">{bar.estimatedCost}</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  if (bar.type === "maintenance") {
    return (
      <div className="bg-slate-900 text-white rounded-lg p-3 shadow-lg text-xs max-w-xs z-50">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          Scheduled Maintenance
        </p>
        <div className="space-y-1 text-slate-200">
          <p>
            <span className="text-slate-400">Service:</span> {bar.project || bar.label}
          </p>
          <p>
            <span className="text-slate-400">Scheduled:</span> {formatDate(bar.startDate)} - {formatDate(bar.endDate)}
          </p>
          <p>
            <span className="text-slate-400">Duration:</span>{" "}
            {Math.ceil((bar.endDate.getTime() - bar.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      </div>
    )
  }

  if (bar.type === "available") {
    return (
      <div className="bg-slate-900 text-white rounded-lg p-3 shadow-lg text-xs max-w-xs z-50">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Available for Deployment
        </p>
        <div className="space-y-1 text-slate-200">
          <p>
            <span className="text-slate-400">Available from:</span> {formatDate(bar.startDate)}
          </p>
          <p>
            <span className="text-slate-400">Location:</span> Yard A
          </p>
        </div>
      </div>
    )
  }

  return null
}

export default function GanttChart({ selectedEquipment, onSelectEquipment }: GanttChartProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(
    new Set(["Excavators", "Dozers", "Dump Trucks", "Generators"]),
  )
  const [hoveredBar, setHoveredBar] = useState<{ barId: string; equipmentId: string } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const groupedEquipment = useMemo(() => {
    const grouped: Record<string, Equipment[]> = {}
    EQUIPMENT_DATA.forEach((eq) => {
      if (!grouped[eq.type]) grouped[eq.type] = []
      grouped[eq.type].push(eq)
    })
    return grouped
  }, [])

  const toggleEquipmentType = (type: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  const getBarPosition = (startDate: Date) => {
    const baseDate = new Date(2025, 10, 1)
    const diff = startDate.getTime() - baseDate.getTime()
    return (diff / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY
  }

  const getBarWidth = (startDate: Date, endDate: Date) => {
    const diff = endDate.getTime() - startDate.getTime()
    return (diff / (1000 * 60 * 60 * 24)) * PIXELS_PER_DAY
  }

  const getStatusColor = (type: ScheduleBar["type"]) => {
    switch (type) {
      case "assigned":
        return "bg-blue-500"
      case "maintenance":
        return "bg-yellow-500"
      case "available":
        return "bg-emerald-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Equipment Gantt Schedule</h2>
        <p className="text-xs text-muted-foreground">November 2025 - January 2026</p>
      </div>

      <div className="flex-1 overflow-auto relative">
        <div className="flex">
          {/* Equipment List */}
          <div className="w-48 border-r border-border bg-card">
            {Object.entries(groupedEquipment).map(([type, equipment]) => (
              <div key={type}>
                <button
                  onClick={() => toggleEquipmentType(type)}
                  className="w-full px-4 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted/50 flex items-center gap-2 border-b border-border"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedTypes.has(type) ? "" : "-rotate-90"}`}
                  />
                  {type}
                </button>
                {expandedTypes.has(type) &&
                  equipment.map((eq) => (
                    <button
                      key={eq.id}
                      onClick={() => onSelectEquipment(eq.id)}
                      className={`w-full px-4 py-3 text-left text-sm border-b border-border hover:bg-muted/50 transition-colors ${
                        selectedEquipment === eq.id ? "bg-accent/10 text-accent" : "text-foreground"
                      }`}
                    >
                      <div className="font-medium truncate">{eq.name}</div>
                      <div className="text-xs text-muted-foreground">{eq.bu}</div>
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Gantt Timeline */}
          <div className="flex-1 overflow-x-auto bg-background">
            {/* Month Headers */}
            <div className="flex sticky top-0 bg-card border-b border-border z-10">
              {MONTH_LABELS.map((month, idx) => (
                <div
                  key={month}
                  style={{ width: idx === 0 ? 92 * PIXELS_PER_DAY : 92 * PIXELS_PER_DAY }}
                  className="px-4 py-2 text-xs font-semibold text-foreground border-r border-border"
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Equipment Rows */}
            <div>
              {Object.entries(groupedEquipment).map(([type, equipment]) => (
                <div key={type}>
                  {expandedTypes.has(type) &&
                    equipment.map((eq) => (
                      <div
                        key={eq.id}
                        className={`flex items-center border-b border-border min-h-12 relative ${
                          selectedEquipment === eq.id ? "bg-accent/5" : "hover:bg-muted/30"
                        }`}
                      >
                        {/* Schedule Bars */}
                        <div className="relative w-full h-full">
                          {eq.schedule.map((bar) => (
                            <div
                              key={bar.id}
                              style={{
                                left: `${getBarPosition(bar.startDate)}px`,
                                width: `${getBarWidth(bar.startDate, bar.endDate)}px`,
                              }}
                              className={`absolute top-1/2 -translate-y-1/2 h-8 rounded px-2 flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:opacity-90 transition-all hover:shadow-lg ${getStatusColor(
                                bar.type,
                              )} ${hoveredBar?.barId === bar.id ? "ring-2 ring-white" : ""}`}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setTooltipPosition({ x: rect.left, y: rect.top })
                                setHoveredBar({ barId: bar.id, equipmentId: eq.id })
                              }}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              <span className="truncate text-white">{bar.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {hoveredBar && (
              <div
                className="fixed pointer-events-none"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 100}px`,
                }}
              >
                {EQUIPMENT_DATA.map((eq) => {
                  if (eq.id !== hoveredBar.equipmentId) return null
                  const bar = eq.schedule.find((b) => b.id === hoveredBar.barId)
                  if (!bar) return null
                  return <ScheduleTooltip key={bar.id} bar={bar} equipment={eq} />
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-border bg-card flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-foreground">Assigned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-foreground">Maintenance</span>
        </div>
      </div>
    </Card>
  )
}
