"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Plus, LinkIcon } from "lucide-react"

export default function AssetCreation() {
  const [formData, setFormData] = useState({
    assetId: "AUTO-GEN",
    name: "",
    category: "",
    serialNumber: "",
    purchasePrice: "",
    vendor: "",
    warrantyStart: "",
    warrantyEnd: "",
    businessUnit: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    hourlyRate: "",
    linkedCapexId: "",
  })

  const [checklist, setChecklist] = useState({
    vista: false,
    incas: false,
    masterList: false,
    gpsTracker: false,
    stickers: false,
  })

  const allChecklistComplete = Object.values(checklist).every((v) => v)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Asset Creation</h1>
          <p className="text-gray-500">Add new equipment to Arena fleet with complete setup checklist</p>
        </div>
        <Button size="lg" disabled={!allChecklistComplete}>
          <Plus className="w-4 h-4 mr-2" />
          Create Asset
        </Button>
      </div>

      {/* Alert for incomplete checklist */}
      {!allChecklistComplete && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Setup Incomplete</AlertTitle>
          <AlertDescription className="text-orange-700">
            Complete all checklist items before creating asset in the system
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Asset Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Basic equipment details and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset ID</Label>
                  <Input value={formData.assetId} disabled className="bg-gray-100" />
                  <p className="text-xs text-gray-500">Auto-generated on save</p>
                </div>
                <div className="space-y-2">
                  <Label>
                    Asset Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., CAT 336 Excavator"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excavator">Excavator</SelectItem>
                      <SelectItem value="bulldozer">Bulldozer</SelectItem>
                      <SelectItem value="loader">Loader</SelectItem>
                      <SelectItem value="crane">Crane</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="attachment">Attachment</SelectItem>
                      <SelectItem value="marine">Marine Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Serial Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Manufacturer serial #"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
              <CardDescription>Vendor and acquisition details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Purchase Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Vendor <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Caterpillar of Louisiana"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty Start Date</Label>
                  <Input
                    type="date"
                    value={formData.warrantyStart}
                    onChange={(e) => setFormData({ ...formData, warrantyStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty End Date</Label>
                  <Input
                    type="date"
                    value={formData.warrantyEnd}
                    onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Link to CAPEX Request (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="CAPEX-2025-024"
                      value={formData.linkedCapexId}
                      onChange={(e) => setFormData({ ...formData, linkedCapexId: e.target.value })}
                    />
                    <Button variant="outline">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Link to approved CAPEX request if applicable</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Card Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Card Setup</CardTitle>
              <CardDescription>Configure billing rates for this asset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Business Unit <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.businessUnit}
                  onValueChange={(v) => setFormData({ ...formData, businessUnit: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FSG">FSG - Foundation Specialists Group</SelectItem>
                    <SelectItem value="FSM">FSM - Foundation Specialists Marine</SelectItem>
                    <SelectItem value="FSE">FSE - Foundation Specialists East</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Internal Rate (Cost Allocation)</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Daily Rate</Label>
                    <Input
                      type="number"
                      placeholder="$"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">&lt;40 hrs/mo</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Weekly Rate</Label>
                    <Input
                      type="number"
                      placeholder="$"
                      value={formData.weeklyRate}
                      onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">40-176 hrs/mo</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Monthly Rate</Label>
                    <Input
                      type="number"
                      placeholder="$"
                      value={formData.monthlyRate}
                      onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">&gt;176 hrs/mo</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hourly (Overage)</Label>
                    <Input
                      type="number"
                      placeholder="$/hr"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Over 176 hrs</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  External and Owner rates can be configured after asset creation in Rate Card Management
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Setup Checklist */}
        <div className="space-y-6">
          <Card className={allChecklistComplete ? "border-green-500 bg-green-50" : "border-orange-300"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {allChecklistComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                )}
                Setup Checklist
              </CardTitle>
              <CardDescription>Complete all items before creating asset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.vista}
                  onChange={(e) => setChecklist({ ...checklist, vista: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Created in Vista</p>
                  <p className="text-xs text-gray-500">Add asset to Vista for depreciation tracking</p>
                </div>
                {checklist.vista && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.incas}
                  onChange={(e) => setChecklist({ ...checklist, incas: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Created in INCAS</p>
                  <p className="text-xs text-gray-500">Register equipment in INCAS system</p>
                </div>
                {checklist.incas && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.masterList}
                  onChange={(e) => setChecklist({ ...checklist, masterList: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Added to Master List</p>
                  <p className="text-xs text-gray-500">Update Equipment Master List spreadsheet</p>
                </div>
                {checklist.masterList && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.gpsTracker}
                  onChange={(e) => setChecklist({ ...checklist, gpsTracker: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">GPS Tracker Installed</p>
                  <p className="text-xs text-gray-500">Install and activate GPS tracking device</p>
                </div>
                {checklist.gpsTracker && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.stickers}
                  onChange={(e) => setChecklist({ ...checklist, stickers: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Company Stickers Applied</p>
                  <p className="text-xs text-gray-500">Apply Arena identification stickers</p>
                </div>
                {checklist.stickers && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
              </label>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Setup Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
              <p>• Vista asset ID will match your Asset ID</p>
              <p>• INCAS tracking begins immediately upon creation</p>
              <p>• GPS coordinates will appear in Fleet Map once activated</p>
              <p>• Stickers must include: Asset ID, BU Code, Contact Phone</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
