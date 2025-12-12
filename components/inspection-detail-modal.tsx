"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface InspectionChecklistItem {
  id: number
  item: string
  status: "pass" | "fail" | "pending"
  notes: string
  photo?: boolean
}

interface InspectionDetailModalProps {
  inspection: any
  onClose: () => void
}

export default function InspectionDetailModal({ inspection, onClose }: InspectionDetailModalProps) {
  const checklistItems: InspectionChecklistItem[] = [
    {
      id: 1,
      item: "Engine oil level adequate",
      status: "pass",
      notes: "Oil at full mark",
      photo: false,
    },
    {
      id: 2,
      item: "Hydraulic fluid level adequate",
      status: "pass",
      notes: "Fluid clean, no leaks",
      photo: false,
    },
    {
      id: 3,
      item: "No fluid leaks visible",
      status: "pass",
      notes: "All hoses checked",
      photo: false,
    },
    {
      id: 4,
      item: "Tracks in good condition",
      status: "pass",
      notes: "Minimal wear",
      photo: false,
    },
    {
      id: 5,
      item: "Bucket/attachment secure",
      status: "pass",
      notes: "All pins tight",
      photo: false,
    },
    {
      id: 6,
      item: "Safety devices functional",
      status: "pass",
      notes: "Backup alarm tested",
      photo: false,
    },
    {
      id: 7,
      item: "Fire extinguisher present",
      status: "pass",
      notes: "Charged, exp: 06/2026",
      photo: false,
    },
    {
      id: 8,
      item: "Windshield condition",
      status: "fail",
      notes: "Cracked windshield",
      photo: true,
    },
  ]

  const failedItems = checklistItems.filter((item) => item.status === "fail")
  const hasFailed = failedItems.length > 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Passed":
        return <Badge className="bg-green-100 text-green-800">Passed ✓</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed ✗</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto z-50 my-8">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{inspection.id}</h2>
              <p className="text-muted-foreground">{inspection.equipment}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">{getStatusBadge(inspection.status)}</div>
        </div>

        <div className="p-6 space-y-6">
          {/* Inspection Info */}
          <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-foreground">Inspection Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{inspection.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Inspector</p>
                <p className="font-medium text-foreground">{inspection.inspector}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date/Time</p>
                <p className="font-medium text-foreground">{inspection.date} 09:30 AM</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">Yard A - Shop Bay 1</p>
              </div>
              <div>
                <p className="text-muted-foreground">Engine Hours</p>
                <p className="font-medium text-foreground">1,250 hrs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fuel Level</p>
                <p className="font-medium text-foreground">75%</p>
              </div>
            </div>
          </div>

          {/* Inspection Checklist */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Inspection Checklist</h3>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Notes</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistItems.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{item.id}</td>
                      <td className="py-3 px-4 text-foreground">{item.item}</td>
                      <td className="py-3 px-4 text-center">
                        {item.status === "pass" && <CheckCircle className="w-5 h-5 text-green-600 inline" />}
                        {item.status === "fail" && <XCircle className="w-5 h-5 text-red-600 inline" />}
                        {item.status === "pending" && <AlertCircle className="w-5 h-5 text-yellow-600 inline" />}
                      </td>
                      <td className="py-3 px-4 text-foreground text-sm">
                        {item.status === "fail" && <span className="font-semibold text-red-600">**{item.notes}**</span>}
                        {item.status !== "fail" && <span className="text-muted-foreground">{item.notes}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.photo && (
                          <button className="text-accent hover:underline text-sm font-medium">📷 View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Outcome */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Inspection Outcome</h3>
            {!hasFailed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-700 mb-2">✓ Inspection Passed</p>
                <div className="space-y-2 text-sm text-green-600">
                  <p>Equipment approved for deployment.</p>
                  <p>
                    Equipment Status: <span className="font-medium">Ready for Deployment</span>
                  </p>
                  <p>No action required.</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-700 mb-3">✗ Inspection Failed</p>
                <div className="space-y-3 text-sm text-red-600">
                  <p>Equipment cannot be deployed until issues resolved.</p>
                  <p>
                    Equipment Status: <span className="font-medium">Pending Repair</span>
                  </p>

                  <div className="mt-4 bg-red-100 rounded p-3">
                    <p className="font-medium text-red-800 mb-2">Issues Created:</p>
                    <div className="space-y-2">
                      {failedItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <span className="text-red-800 font-bold">•</span>
                          <div>
                            <p className="font-medium text-red-800">
                              Issue #ISS-{789 + item.id}: {item.notes} (Critical)
                            </p>
                            <p className="text-red-700 text-xs">Work Order: WO-{1245 + item.id} | Due: 11/12/2025</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3">Equipment will remain in Yard until repairs complete.</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-border flex-wrap">
            {inspection.status === "Pending" && (
              <>
                <Button className="flex-1 bg-accent hover:bg-accent/90">Complete Inspection</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
            {inspection.status === "Passed" && (
              <>
                <Button className="flex-1 bg-accent hover:bg-accent/90">Print Report</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download PDF
                </Button>
              </>
            )}
            {inspection.status === "Failed" && (
              <>
                <Button className="flex-1 bg-accent hover:bg-accent/90">View Linked Work Order</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Update Status
                </Button>
              </>
            )}
            {inspection.status === "In Progress" && (
              <>
                <Button className="flex-1 bg-accent hover:bg-accent/90">Mark as Passed</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Mark as Failed
                </Button>
              </>
            )}
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
