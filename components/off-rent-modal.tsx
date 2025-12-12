"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Upload, Camera, CheckCircle, AlertCircle, RotateCcw } from "lucide-react"

interface OffRentModalProps {
  isOpen: boolean
  onClose: () => void
  rental: {
    id: string
    equipment: string
    equipmentId: string
    project: string
    jobCode: string
    bu: string
    startDate: string
    currentHours: number
  }
  onSubmit: (data: OffRentData) => void
}

interface OffRentData {
  returnDate: string
  meterReading: number
  condition: string
  fuelLevel: string
  returnLocation: string
  keysReturned: boolean
  manualsReturned: boolean
  equipmentCleaned: boolean
  damageNotes: string
  photos: string[]
}

const returnLocations = [
  "Five-S Yard - Baton Rouge",
  "Five-S Yard - New Orleans",
  "Five-S Marine Yard",
  "Southern Stone Yard",
  "FSE Storage Lot",
  "Other (Specify)",
]

export default function OffRentModal({ isOpen, onClose, rental, onSubmit }: OffRentModalProps) {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0])
  const [meterReading, setMeterReading] = useState(rental.currentHours.toString())
  const [condition, setCondition] = useState("")
  const [fuelLevel, setFuelLevel] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [keysReturned, setKeysReturned] = useState(false)
  const [manualsReturned, setManualsReturned] = useState(false)
  const [equipmentCleaned, setEquipmentCleaned] = useState(false)
  const [damageNotes, setDamageNotes] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const daysOnRent = Math.ceil(
    (new Date(returnDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  const handlePhotoUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setPhotos([...photos, `photo_${photos.length + 1}.jpg`])
      setUploading(false)
    }, 1000)
  }

  const handleSubmit = () => {
    onSubmit({
      returnDate,
      meterReading: Number.parseInt(meterReading),
      condition,
      fuelLevel,
      returnLocation,
      keysReturned,
      manualsReturned,
      equipmentCleaned,
      damageNotes,
      photos,
    })
    onClose()
  }

  const isFormValid = condition && meterReading && returnLocation

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            Off-Rent Request
          </DialogTitle>
          <DialogDescription>Return equipment from rental</DialogDescription>
        </DialogHeader>

        {/* Rental Summary */}
        <div className="bg-muted p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Equipment:</span>{" "}
              <span className="font-medium">{rental.equipment}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Asset ID:</span>{" "}
              <span className="font-mono">{rental.equipmentId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Project:</span>{" "}
              <span className="font-medium">{rental.project}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Job Code:</span>{" "}
              <span className="font-mono">{rental.jobCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Business Unit:</span> <Badge variant="outline">{rental.bu}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Rental Period:</span>{" "}
              <span>
                {rental.startDate} - {returnDate}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Days on Rent:</span>{" "}
              <span className="font-bold">{daysOnRent} days</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Return Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Return Date *</Label>
              <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Meter Reading (Hours) *</Label>
              <Input
                type="number"
                value={meterReading}
                onChange={(e) => setMeterReading(e.target.value)}
                placeholder="Current hours"
              />
            </div>
          </div>

          {/* Condition Assessment */}
          <div className="space-y-2">
            <Label>Equipment Condition *</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent - No issues</SelectItem>
                <SelectItem value="good">Good - Minor wear</SelectItem>
                <SelectItem value="fair">Fair - Normal wear</SelectItem>
                <SelectItem value="damaged">Damaged - Requires repair</SelectItem>
                <SelectItem value="breakdown">Breakdown - Major repair needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(condition === "damaged" || condition === "breakdown") && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                A work order will be automatically created for maintenance review.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuel Level</Label>
              <Select value={fuelLevel} onValueChange={setFuelLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full (100%)</SelectItem>
                  <SelectItem value="3/4">3/4 (75%)</SelectItem>
                  <SelectItem value="half">Half (50%)</SelectItem>
                  <SelectItem value="quarter">Quarter (25%)</SelectItem>
                  <SelectItem value="empty">Empty (&lt;10%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Return Location *</Label>
              <Select value={returnLocation} onValueChange={setReturnLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  {returnLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Return Checklist */}
          <div className="space-y-3">
            <Label>Return Checklist</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={keysReturned}
                  onChange={(e) => setKeysReturned(e.target.checked)}
                  className="rounded"
                />
                <span>Keys returned</span>
                {keysReturned && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={manualsReturned}
                  onChange={(e) => setManualsReturned(e.target.checked)}
                  className="rounded"
                />
                <span>Operator manuals returned</span>
                {manualsReturned && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={equipmentCleaned}
                  onChange={(e) => setEquipmentCleaned(e.target.checked)}
                  className="rounded"
                />
                <span>Equipment cleaned</span>
                {equipmentCleaned && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
              </label>
            </div>
          </div>

          {/* Damage Notes */}
          <div className="space-y-2">
            <Label>Damage / Issues Notes</Label>
            <Textarea
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="Describe any damage, issues, or notes about the equipment condition..."
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Return Photos</Label>
            <p className="text-xs text-muted-foreground">
              Upload photos: Front, Rear, Both Sides, Operator Station, Any Damage
            </p>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" onClick={handlePhotoUpload} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Photos"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={!isFormValid}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Submit Off-Rent Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
