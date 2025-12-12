"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Request {
  id: string
  number: string
  equipment: string
  type: string
  dates: string
  project: string
  status: "pending" | "approved" | "assigned"
  priority: "high" | "normal"
}

const REQUESTS: Request[] = [
  {
    id: "1",
    number: "REQ-456",
    equipment: "20-ton Excavator",
    type: "Excavators",
    dates: "Nov 28 - Dec 15",
    project: "Bunge Project",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    number: "REQ-457",
    equipment: "Dump Truck",
    type: "Dump Trucks",
    dates: "Dec 1-10",
    project: "Lake Charles Marine",
    status: "pending",
    priority: "normal",
  },
  {
    id: "3",
    number: "REQ-458",
    equipment: "Dozer",
    type: "Dozers",
    dates: "Nov 25 - Dec 20",
    project: "Southern Stone Quarry",
    status: "pending",
    priority: "high",
  },
]

const getStatusBadge = (status: Request["status"]) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
    case "approved":
      return <Badge className="bg-blue-500/20 text-blue-700">Approved</Badge>
    case "assigned":
      return <Badge className="bg-emerald-500/20 text-emerald-700">Assigned</Badge>
  }
}

const getPriorityColor = (priority: Request["priority"]) => {
  return priority === "high" ? "text-red-500" : "text-gray-500"
}

export default function PendingRequests() {
  return (
    <Card className="w-72 bg-card border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Pending Requests</h3>
        <p className="text-xs text-muted-foreground">{REQUESTS.length} awaiting assignment</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {REQUESTS.map((req) => (
          <div key={req.id} className="p-4 border-b border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <p className="text-xs font-mono text-muted-foreground">{req.number}</p>
                <p className="font-medium text-foreground text-sm">{req.equipment}</p>
              </div>
              <span className={`text-lg ${getPriorityColor(req.priority)}`}>●</span>
            </div>

            <div className="space-y-1 mb-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{req.project}</span>
              </p>
              <p className="text-xs text-muted-foreground">{req.dates}</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              {getStatusBadge(req.status)}
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Assign
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
