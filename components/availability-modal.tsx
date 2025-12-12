"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AvailabilityModalProps {
  request: any
  onClose: () => void
  onAssign: () => void
}

const rateTemplates = {
  "Heavy Equipment Standard Rates": {
    hourly: 350,
    daily: 2200,
    weekly: 12000,
    monthly: 45000,
    internalRate: 300,
    externalRate: 400,
    ownerTM: 350,
  },
}

export default function AvailabilityModal({ request, onClose, onAssign }: AvailabilityModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Heavy Equipment Standard Rates")
  const [selectedRateType, setSelectedRateType] = useState("daily")
  const [rateTypeApply, setRateTypeApply] = useState("internal")
  const [requiresInspection, setRequiresInspection] = useState(true)
  const [approvalNotes, setApprovalNotes] = useState("")

  const availableEquipment = [
    {
      id: "CR-002",
      name: "Mobile Crane 50T",
      available: true,
      location: "Yard A",
      lastInspection: "11/08/2025",
      inspectionExpired: false,
    },
    {
      id: "CR-003",
      name: "Mobile Crane 50T",
      available: true,
      location: "Equipment Store",
      lastInspection: "10/25/2025",
      inspectionExpired: true,
    },
  ]

  // Calculate rates based on duration
  const template = rateTemplates[selectedTemplate as keyof typeof rateTemplates]
  let recommendedRateType = "daily"
  if (request.days < 3) recommendedRateType = "daily"
  else if (request.days < 7) recommendedRateType = "weekly"
  else recommendedRateType = "monthly"

  const getRateAmount = () => {
    const rates: Record<string, number> = {
      hourly: template.hourly,
      daily: template.daily,
      weekly: template.weekly,
      monthly: template.monthly,
      internal: template.internalRate,
      external: template.externalRate,
      ownerTM: template.ownerTM,
    }
    return rates[selectedRateType] || template.daily
  }

  const calculateTotal = () => {
    const rate = getRateAmount()
    if (selectedRateType === "hourly") return rate * 24 * request.days
    if (selectedRateType === "daily") return rate * request.days
    if (selectedRateType === "weekly") return rate * Math.ceil(request.days / 7)
    if (selectedRateType === "monthly") return rate * Math.ceil(request.days / 30)
    return 0
  }

  const estimatedCost = calculateTotal()
  const estimatedProfit = estimatedCost * 0.599

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-card border-border my-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{request.id} - Equipment Availability & Rate Card</h2>
          <p className="text-sm text-muted-foreground mt-1">{request.equipment}</p>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Request Summary */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Needed:</span> {request.dateRange} ({request.days} days)
            </p>
            <p className="text-sm text-foreground mt-1">
              <span className="font-semibold">Project:</span> {request.project} ({request.businessUnit})
            </p>
          </div>

          {/* Equipment Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Available Equipment</h3>
            <div className="space-y-2">
              {availableEquipment.map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => setSelectedEquipment(eq.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedEquipment === eq.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {eq.id} - {eq.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Location: {eq.location}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Last Inspection: {eq.lastInspection} {eq.inspectionExpired ? "⚠️ Expired" : "✅"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="equipment"
                      checked={selectedEquipment === eq.id}
                      onChange={() => setSelectedEquipment(eq.id)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Card Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Rate Card Selection</h3>

            {/* Template Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Step 1: Select Rate Card Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
              >
                <option>Heavy Equipment Standard Rates</option>
                <option>Marine Equipment Rates</option>
                <option>Light Equipment Rates</option>
                <option>Owner Equipment Rates</option>
              </select>
            </div>

            {/* Rate Preview Table */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Step 2: Select Rate Type</label>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left text-muted-foreground">Rate Type</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Amount</th>
                      <th className="px-4 py-2 text-left text-muted-foreground">Select</th>
                      <th className="px-4 py-2 text-right text-muted-foreground">Total ({request.days} days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: "hourly", label: "Hourly", amount: "$350/hr" },
                      { key: "daily", label: "Daily", amount: "$2,200/day", highlight: true },
                      { key: "weekly", label: "Weekly", amount: "$12,000/wk" },
                      { key: "monthly", label: "Monthly", amount: "$45,000/mo" },
                    ].map((rate) => (
                      <tr
                        key={rate.key}
                        className={`border-b border-border ${
                          rate.highlight ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-muted"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{rate.label}</td>
                        <td className="px-4 py-3 text-foreground">{rate.amount}</td>
                        <td className="px-4 py-3">
                          <input
                            type="radio"
                            name="rateType"
                            checked={selectedRateType === rate.key}
                            onChange={() => setSelectedRateType(rate.key)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          ${(getRateAmount() * request.days).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Auto-Selected: {recommendedRateType} rate based on {request.days}-day duration
              </p>
            </div>

            {/* Rate Application Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Step 3: Rate Application Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="rateTypeApply"
                    value="internal"
                    checked={rateTypeApply === "internal"}
                    onChange={(e) => setRateTypeApply(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Internal Rate ($300/hr equivalent)</p>
                    <p className="text-xs text-muted-foreground">Same BU assignment - {request.businessUnit} project</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="rateTypeApply"
                    value="external"
                    checked={rateTypeApply === "external"}
                    onChange={(e) => setRateTypeApply(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">External Rate ($400/hr equivalent)</p>
                    <p className="text-xs text-muted-foreground">Cross-BU or third-party rental</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border">
            <h4 className="font-semibold text-foreground">Cost Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Equipment:</span>
                <span className="font-medium text-foreground">
                  {selectedEquipment
                    ? availableEquipment.find((e) => e.id === selectedEquipment)?.name
                    : "Select equipment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">{request.days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate Applied:</span>
                <span className="font-medium text-foreground">
                  {rateTypeApply === "internal" ? "Internal" : "External"} {selectedRateType} rate
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between">
                <span className="font-medium text-foreground">Estimated Total Billing:</span>
                <span className="text-lg font-bold text-accent">${estimatedCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Estimated Profit (59.9%):</span>
                <span className="text-green-600 font-medium">${estimatedProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Pre-Deployment Inspection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Pre-Deployment Inspection</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresInspection}
                onChange={(e) => setRequiresInspection(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Required (Recommended - last inspection &gt; 14 days)</span>
            </label>
          </div>

          {/* Approval Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Approval Notes (Optional)</label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Add any notes about rate selection or special conditions..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm resize-none h-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={onAssign} className="flex-1 bg-accent hover:bg-accent/90" disabled={!selectedEquipment}>
              Approve Request & Assign Equipment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
