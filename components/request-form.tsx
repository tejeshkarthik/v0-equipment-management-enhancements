"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface RequestFormProps {
  onClose: () => void
  onSubmit?: (data: any) => void
}

export default function RequestForm({ onClose, onSubmit }: RequestFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    equipmentType: "",
    quantity: "1",
    specificEquipment: [] as string[],
    projectName: "",
    businessUnit: "Five-S Group",
    jobLocation: "",
    contactPerson: "",
    contactPhone: "",
    requiredDate: "",
    returnDate: "",
    urgency: "Routine",
    justification: "",
    specialRequirements: "",
    estimatedHours: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.equipmentType) newErrors.equipmentType = "Equipment type is required"
    if (!formData.projectName) newErrors.projectName = "Project name is required"
    if (!formData.jobLocation) newErrors.jobLocation = "Job location is required"
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required"
    if (!formData.contactPhone) newErrors.contactPhone = "Contact phone is required"
    if (!formData.requiredDate) newErrors.requiredDate = "Required date is required"
    if (!formData.returnDate) newErrors.returnDate = "Return date is required"
    if (formData.justification.length < 50) newErrors.justification = "Justification must be at least 50 characters"
    if (new Date(formData.returnDate) <= new Date(formData.requiredDate))
      newErrors.returnDate = "Return date must be after required date"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Generate request ID
    const requestId = `REQ-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    toast({
      title: "Success",
      description: `Request ${requestId} submitted successfully`,
    })

    if (onSubmit) {
      onSubmit({ ...formData, id: requestId, status: "Submitted" })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-lg font-semibold text-foreground">New Equipment Request</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
              1. Request Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Equipment Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  value={formData.equipmentType}
                  onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                >
                  <option value="">Select equipment type...</option>
                  <option value="excavator">Excavator</option>
                  <option value="dozer">Dozer</option>
                  <option value="dump-truck">Dump Truck</option>
                  <option value="generator">Generator</option>
                  <option value="crane">Crane</option>
                  <option value="small-tools">Small Tools</option>
                </select>
                {errors.equipmentType && <p className="text-red-500 text-xs mt-1">{errors.equipmentType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <span className="text-sm text-muted-foreground">Units</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Specific Equipment (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CR-001, CR-003"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    onChange={(e) => setFormData({ ...formData, specificEquipment: e.target.value.split(",") })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
              2. Project Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                >
                  <option value="">Select project...</option>
                  <option value="Bunge Grain Elevator">Bunge Grain Elevator</option>
                  <option value="Metro Transit">Metro Transit</option>
                  <option value="Lake Charles Marine">Lake Charles Marine</option>
                  <option value="Skyscraper Development">Skyscraper Development</option>
                  <option value="Highway Expansion">Highway Expansion</option>
                </select>
                {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Business Unit</label>
                <input
                  type="text"
                  disabled
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground cursor-not-allowed"
                  value={formData.businessUnit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Location / Jobsite Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter jobsite address..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  value={formData.jobLocation}
                  onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                />
                {errors.jobLocation && <p className="text-red-500 text-xs mt-1">{errors.jobLocation}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    On-Site Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                  {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="(225) 555-0123"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Requirements Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
              3. Schedule Requirements
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Required On-Site Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                  />
                  {errors.requiredDate && <p className="text-red-500 text-xs mt-1">{errors.requiredDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Planned Return Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  />
                  {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {["Routine", "Urgent", "Critical"].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={formData.urgency === level}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">
                        {level}
                        {level === "Routine" && " (Standard 2-3 day processing)"}
                        {level === "Urgent" && " (Expedited 24-hour processing)"}
                        {level === "Critical" && " (Immediate need, skip approvals)"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
              4. Additional Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Justification / Reason for Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Explain why equipment is needed and what work it will perform... (Minimum 50 characters)"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  rows={3}
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.justification.length}/50 characters minimum
                </p>
                {errors.justification && <p className="text-red-500 text-xs mt-1">{errors.justification}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Requirements (Optional)
                </label>
                <textarea
                  placeholder="Any special attachments, operator certifications, or conditions..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  rows={2}
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Estimated Hours of Use (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                  <span className="text-sm text-muted-foreground">Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-filled fields */}
          <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
            <p>Requested By: Current User Name</p>
            <p>Date Submitted: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
