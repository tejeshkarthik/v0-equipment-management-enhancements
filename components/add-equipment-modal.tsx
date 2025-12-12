"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddEquipmentModalProps {
  onClose: () => void
  onEquipmentAdded?: (equipment: any) => void
}

export default function AddEquipmentModal({ onClose, onEquipmentAdded }: AddEquipmentModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    equipmentName: "",
    equipmentType: "Excavator",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    serialNumber: "",
    businessUnit: "FVS",
    purchasePrice: "",
    purchaseDate: "",
    status: "Available",
    location: "Yard A",
  })

  // Auto-generated ID logic
  const generateEquipmentId = () => {
    const typePrefix =
      {
        Excavator: "EXC",
        Dozer: "DOZ",
        "Dump Truck": "DT",
        Generator: "GEN",
        Crane: "CR",
      }[formData.equipmentType] || "EQ"
    // In real app, this would query DB for next number
    return `${typePrefix}-006`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Validation
    if (!formData.equipmentName || !formData.make || !formData.model || !formData.serialNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newEquipment = {
      id: generateEquipmentId(),
      name: formData.equipmentName,
      type: formData.equipmentType,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      serialNumber: formData.serialNumber,
      businessUnit: formData.businessUnit,
      purchasePrice: formData.purchasePrice,
      purchaseDate: formData.purchaseDate,
      status: formData.status,
      location: formData.location,
    }

    // Call callback if provided
    if (onEquipmentAdded) {
      onEquipmentAdded(newEquipment)
    }

    toast({
      title: "Success",
      description: `Equipment ${newEquipment.id} created successfully`,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto z-50 my-8">
        <div className="p-6 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add New Equipment</h2>
            <p className="text-muted-foreground text-sm mt-1">Equipment ID: {generateEquipmentId()} (auto-generated)</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Equipment Name */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Equipment Name *</label>
            <Input
              placeholder="e.g., CAT 320 Excavator"
              value={formData.equipmentName}
              onChange={(e) => handleInputChange("equipmentName", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Equipment Type */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Equipment Type *</label>
              <select
                value={formData.equipmentType}
                onChange={(e) => handleInputChange("equipmentType", e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              >
                <option>Excavator</option>
                <option>Dozer</option>
                <option>Dump Truck</option>
                <option>Generator</option>
                <option>Crane</option>
              </select>
            </div>

            {/* Business Unit */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Business Unit *</label>
              <select
                value={formData.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="FVS">Five-S Group (FVS)</option>
                <option value="MAR">Five-S Marine (MAR)</option>
                <option value="SSS">Southern Stone & Soil (SSS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Make *</label>
              <Input
                placeholder="e.g., Caterpillar"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
              />
            </div>

            {/* Model */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Model *</label>
              <Input
                placeholder="e.g., 320"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Year */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Year</label>
              <Input
                type="number"
                placeholder="2024"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Serial Number *</label>
              <Input
                placeholder="e.g., CAT320-2024"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Purchase Price */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Purchase Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Purchase Date</label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              >
                <option>Available</option>
                <option>On Rent</option>
                <option>In Maintenance</option>
                <option>Out of Service</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="Yard A">Yard A</option>
                <option value="Yard B">Yard B</option>
                <option value="Yard C">Yard C</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border flex gap-2 justify-end">
          <Button variant="outline" className="bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-accent hover:bg-accent/90" onClick={handleSave}>
            Save Equipment
          </Button>
        </div>
      </Card>
    </div>
  )
}
