"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface EquipmentDetailProps {
  equipmentId: string
  onClose: () => void
}

const EQUIPMENT_DETAILS: Record<string, any> = {
  "exc-19730": {
    name: "Excavator #19730",
    type: "Excavators",
    model: "CAT 330",
    bu: "Corporate",
    status: "In Use",
    hourlyRate: "$250",
    dailyRate: "$1,500",
    weeklyRate: "$7,500",
    monthlyRate: "$25,000",
    currentAssignment: "Bunge Project (Nov 1-30)",
    nextAvailable: "Dec 1, 2025",
    totalHours: "2,450h",
    lastMaintenance: "Oct 15, 2025",
  },
  "doz-126": {
    name: "Dozer #DOZ-126",
    type: "Dozers",
    model: "CAT D8",
    bu: "Southeast",
    status: "In Use",
    hourlyRate: "$300",
    dailyRate: "$1,800",
    weeklyRate: "$9,000",
    monthlyRate: "$30,000",
    currentAssignment: "Southern Stone Quarry (Nov 10 - Dec 5)",
    nextAvailable: "Dec 6, 2025",
    totalHours: "3,120h",
    lastMaintenance: "Oct 1, 2025",
  },
}

export default function EquipmentDetail({ equipmentId, onClose }: EquipmentDetailProps) {
  const details = EQUIPMENT_DETAILS[equipmentId] || EQUIPMENT_DETAILS["exc-19730"]

  return (
    <Card className="w-80 bg-card border-border flex flex-col max-h-[calc(100vh-120px)]">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{details.name}</h3>
          <p className="text-xs text-muted-foreground">{details.model}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">STATUS</p>
          <Badge className="bg-blue-500/20 text-blue-700">{details.status}</Badge>
        </div>

        {/* Current Assignment */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">CURRENT ASSIGNMENT</p>
          <p className="text-sm text-foreground">{details.currentAssignment}</p>
        </div>

        {/* Next Available */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">NEXT AVAILABLE</p>
          <p className="text-sm text-foreground">{details.nextAvailable}</p>
        </div>

        {/* Rate Card */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">RATE CARD</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly</span>
              <span className="text-foreground font-medium">{details.hourlyRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily</span>
              <span className="text-foreground font-medium">{details.dailyRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly</span>
              <span className="text-foreground font-medium">{details.weeklyRate}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 mt-1">
              <span className="text-muted-foreground">Monthly</span>
              <span className="text-foreground font-medium">{details.monthlyRate}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Info */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">MAINTENANCE</p>
          <p className="text-sm text-foreground">Last Service: {details.lastMaintenance}</p>
          <p className="text-sm text-muted-foreground">Total Hours: {details.totalHours}</p>
        </div>
      </div>

      <div className="p-4 border-t border-border flex gap-2">
        <Button className="flex-1 bg-accent hover:bg-accent/90">Assign</Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Details
        </Button>
      </div>
    </Card>
  )
}
