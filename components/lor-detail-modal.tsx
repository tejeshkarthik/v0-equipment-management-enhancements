"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, Clock } from "lucide-react"

interface LORDetailModalProps {
  request: any
  onClose: () => void
}

export default function LORDetailModal({ request, onClose }: LORDetailModalProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Routine":
        return "bg-gray-100 text-gray-800"
      case "Urgent":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Ready for Dispatch":
        return "bg-yellow-100 text-yellow-800"
      case "In Transit":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const approvalHistory = [
    {
      status: "Submitted",
      timestamp: "11/08/2025 10:30 AM",
      by: "John Smith",
      comment: null,
      completed: true,
    },
    {
      status: "Site Superintendent Approved",
      timestamp: "11/08/2025 02:15 PM",
      by: "Mike Johnson",
      comment: "Approved - checked project schedule",
      completed: true,
    },
    {
      status: "Equipment Coordinator Reviewed",
      timestamp: "11/08/2025 04:30 PM",
      by: "Lindsey Foster",
      comment: "Excavator available, assigned EXC-001",
      completed: true,
    },
    {
      status: "Pending Final Approval",
      timestamp: null,
      by: "André Smith (Head Office Manager)",
      comment: null,
      completed: false,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto z-50 my-8">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{request.id}</h2>
              <p className="text-muted-foreground">{request.project}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge className={getStatusColor(request.status || "Submitted")}>{request.status}</Badge>
            <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Request Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Request Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Equipment Requested</p>
                <p className="font-semibold text-foreground">{request.equipment}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold text-foreground">1 unit</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-semibold text-foreground">{request.requestedBy}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Date Submitted</p>
                <p className="font-semibold text-foreground">11/08/2025 10:30 AM</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Justification</p>
                <p className="text-foreground text-sm">
                  "Need excavator for foundation digging phase. Work scheduled to start Nov 15 per project timeline."
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-foreground">Date Requirements</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Required On Site</p>
                  <p className="font-medium text-foreground">11/15/2025</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Planned Return</p>
                  <p className="font-medium text-foreground">11/30/2025</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">15 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Approval History Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Approval History</h3>
            <div className="space-y-4">
              {approvalHistory.map((approval, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        approval.completed
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground border-2 border-muted-foreground"
                      }`}
                    >
                      {approval.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    {idx < approvalHistory.length - 1 && (
                      <div
                        className={`w-0.5 h-12 my-1 ${approval.completed ? "bg-green-500" : "bg-muted-foreground"}`}
                      ></div>
                    )}
                  </div>

                  <div className="pb-4 flex-1">
                    <p className="font-semibold text-foreground">{approval.status}</p>
                    {approval.timestamp && <p className="text-xs text-muted-foreground">{approval.timestamp}</p>}
                    <p className="text-sm text-muted-foreground mt-1">By: {approval.by}</p>
                    {approval.comment && (
                      <p className="text-sm text-foreground mt-2 bg-muted/50 p-3 rounded-lg italic">
                        "{approval.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Assigned Equipment & Rate Card (if approved) */}
          {request.status !== "Submitted" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Assigned Equipment & Rate Card</h3>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-3">✓ Assigned: EXC-001 - CAT 320 Excavator</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Rate Template</p>
                    <p className="font-medium text-foreground">Heavy Equipment Standard Rates</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate Type Applied</p>
                    <p className="font-medium text-foreground">Internal Daily Rate - $2,400/day</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">15 days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Total Billing</p>
                    <p className="font-bold text-accent">$36,000</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Rate Applied By</p>
                    <p className="font-medium text-foreground">
                      Lindsey Foster (Equipment Coordinator) - 11/08/2025 04:30 PM
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Justification</p>
                    <p className="font-medium text-foreground">Internal project assignment per company policy</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs">
                    View Full Rate Card
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Modify Rate
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-foreground">Assigned Operator</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operator</span>
                    <span className="font-medium text-foreground">Alonso Palacios</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="font-medium text-foreground">(225) 555-9876</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-foreground">Pre-Deployment Inspection</h4>
                <p className="text-sm text-yellow-600 font-medium">⏳ Pending (Due: 11/14/2025)</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-border">
            {request.status === "Submitted" && (
              <>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                  Reject
                </Button>
                <Button className="flex-1 bg-accent hover:bg-accent/90">Approve</Button>
              </>
            )}
            {request.status === "Approved" && (
              <Button className="w-full bg-accent hover:bg-accent/90">Assign Equipment</Button>
            )}
            {request.status === "Ready for Dispatch" && (
              <Button className="w-full bg-accent hover:bg-accent/90">Check Out</Button>
            )}
            {request.status === "In Transit" && (
              <Button className="w-full bg-accent hover:bg-accent/90">Check In</Button>
            )}
            {!["Submitted", "Approved", "Ready for Dispatch", "In Transit"].includes(request.status) && (
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Close
              </Button>
            )}
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              {request.status === "Submitted" || request.status === "Approved" ? "Cancel Request" : "Print"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
