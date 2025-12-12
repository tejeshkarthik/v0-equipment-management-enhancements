"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calculator,
  Check,
  DollarSign,
  FileSpreadsheet,
  MapPin,
  Plus,
  Send,
  Truck,
  Clock,
  Building2,
} from "lucide-react"

// Five-S Hauling Workflow:
// 1. PM requests equipment move via haul form
// 2. Coordinator adds to Transport Log
// 3. If internal: use Lowboy Cost Calculator to determine billing
// 4. If external: get 3 vendor quotes, get approval, issue PO
// 5. Post billing to Vista (EM Usage Posting)

interface HaulRequest {
  id: string
  requestId: string
  equipmentId: string
  equipmentName: string
  fromLocation: string
  toLocation: string
  fromJobCode: string
  toJobCode: string
  requestedBy: string
  requestDate: string
  neededBy: string
  haulType: "internal" | "external"
  vendor: string | null
  driver: string | null
  estimatedMiles: number
  estimatedCost: number
  actualCost: number | null
  poNumber: string | null
  status: "pending" | "scheduled" | "in-transit" | "delivered" | "billed"
  billingCode: string | null
  notes: string
}

interface CostCalculation {
  baseMileageRate: number
  totalMiles: number
  mileageCost: number
  fuelSurcharge: number
  permitFees: number
  pilotCarFees: number
  totalCost: number
}

const haulRequests: HaulRequest[] = [
  {
    id: "H001",
    requestId: "HAUL-2025-0847",
    equipmentId: "EQ-2847",
    equipmentName: "CAT 336 Excavator",
    fromLocation: "Five-S Yard - Baton Rouge",
    toLocation: "LA-2847 Highway Expansion",
    fromJobCode: "YARD-001",
    toJobCode: "2847-001",
    requestedBy: "Mike Johnson",
    requestDate: "2025-12-10",
    neededBy: "2025-12-12",
    haulType: "internal",
    vendor: null,
    driver: "James Wilson",
    estimatedMiles: 45,
    estimatedCost: 1250,
    actualCost: null,
    poNumber: null,
    status: "scheduled",
    billingCode: null,
    notes: "",
  },
  {
    id: "H002",
    requestId: "HAUL-2025-0848",
    equipmentId: "EQ-1923",
    equipmentName: "Komatsu D65 Dozer",
    fromLocation: "TX-1156 Port Dredging",
    toLocation: "LA-3321 Levee Repair",
    fromJobCode: "1156-003",
    toJobCode: "3321-002",
    requestedBy: "Sarah Mitchell",
    requestDate: "2025-12-11",
    neededBy: "2025-12-14",
    haulType: "external",
    vendor: "Landstar Transport",
    driver: null,
    estimatedMiles: 180,
    estimatedCost: 3200,
    actualCost: 3150,
    poNumber: "PO-2025-3847",
    status: "delivered",
    billingCode: "3321-002-EQ",
    notes: "",
  },
  {
    id: "H003",
    requestId: "HAUL-2025-0849",
    equipmentId: "EQ-5678",
    equipmentName: "Grove RT880E Crane",
    fromLocation: "LA-3321 Levee Repair",
    toLocation: "Five-S Yard - Baton Rouge",
    fromJobCode: "3321-002",
    toJobCode: "YARD-001",
    requestedBy: "Tom Anderson",
    requestDate: "2025-12-11",
    neededBy: "2025-12-13",
    haulType: "external",
    vendor: null,
    driver: null,
    estimatedMiles: 65,
    estimatedCost: 4500,
    actualCost: null,
    poNumber: null,
    status: "pending",
    billingCode: null,
    notes: "Requires oversize permits - 12ft wide",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
    case "in-transit":
      return <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    case "billed":
      return <Badge className="bg-teal-100 text-teal-800">Billed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function HaulingTransportLog() {
  const [activeTab, setActiveTab] = useState("transport-log")
  const [newHaulOpen, setNewHaulOpen] = useState(false)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [billingOpen, setBillingOpen] = useState(false)
  const [selectedHaul, setSelectedHaul] = useState<HaulRequest | null>(null)

  // Cost Calculator State
  const [calcMiles, setCalcMiles] = useState("45")
  const [calcEquipmentWeight, setCalcEquipmentWeight] = useState("80000")
  const [calcRequiresPermit, setCalcRequiresPermit] = useState(false)
  const [calcRequiresPilot, setCalcRequiresPilot] = useState(false)

  const calculateHaulCost = (): CostCalculation => {
    const miles = Number(calcMiles) || 0
    const baseMileageRate = 8.5 // per mile for lowboy
    const mileageCost = miles * baseMileageRate
    const fuelSurcharge = mileageCost * 0.15 // 15% fuel surcharge
    const permitFees = calcRequiresPermit ? 350 : 0
    const pilotCarFees = calcRequiresPilot ? miles * 3.5 : 0 // $3.50/mile for pilot
    const totalCost = mileageCost + fuelSurcharge + permitFees + pilotCarFees

    return {
      baseMileageRate,
      totalMiles: miles,
      mileageCost,
      fuelSurcharge,
      permitFees,
      pilotCarFees,
      totalCost,
    }
  }

  const pendingHauls = haulRequests.filter((h) => h.status === "pending")
  const inProgressHauls = haulRequests.filter((h) => h.status === "scheduled" || h.status === "in-transit")
  const completedUnbilled = haulRequests.filter((h) => h.status === "delivered" && !h.billingCode)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hauling & Transport Log</h1>
          <p className="text-gray-500">Manage equipment moves, cost calculation, and haul billing</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Lowboy Cost Calculator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Lowboy Cost to Bill Calculator</DialogTitle>
                <DialogDescription>Calculate haul cost for internal billing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Total Miles (One Way)</Label>
                  <Input type="number" value={calcMiles} onChange={(e) => setCalcMiles(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Equipment Weight (lbs)</Label>
                  <Input
                    type="number"
                    value={calcEquipmentWeight}
                    onChange={(e) => setCalcEquipmentWeight(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={calcRequiresPermit}
                      onChange={(e) => setCalcRequiresPermit(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Requires Oversize Permit</span>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={calcRequiresPilot}
                      onChange={(e) => setCalcRequiresPilot(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Requires Pilot Car</span>
                  </label>
                </div>

                {/* Calculation Results */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-4 space-y-2">
                    {(() => {
                      const calc = calculateHaulCost()
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Mileage ({calc.totalMiles} mi × ${calc.baseMileageRate}):
                            </span>
                            <span className="font-mono">${calc.mileageCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Fuel Surcharge (15%):</span>
                            <span className="font-mono">${calc.fuelSurcharge.toFixed(2)}</span>
                          </div>
                          {calc.permitFees > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Permit Fees:</span>
                              <span className="font-mono">${calc.permitFees.toFixed(2)}</span>
                            </div>
                          )}
                          {calc.pilotCarFees > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Pilot Car ({calc.totalMiles} mi × $3.50):</span>
                              <span className="font-mono">${calc.pilotCarFees.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total Cost to Bill:</span>
                            <span className="text-green-600">${calc.totalCost.toFixed(2)}</span>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCalculatorOpen(false)}>
                  Close
                </Button>
                <Button>Apply to Haul Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={newHaulOpen} onOpenChange={setNewHaulOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Haul Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Equipment Haul Request</DialogTitle>
                <DialogDescription>Request equipment transport between jobsites</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eq-2847">EQ-2847 - CAT 336 Excavator</SelectItem>
                      <SelectItem value="eq-1923">EQ-1923 - Komatsu D65 Dozer</SelectItem>
                      <SelectItem value="eq-5678">EQ-5678 - Grove RT880E Crane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Haul Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal (Five-S Driver)</SelectItem>
                      <SelectItem value="external">External (Third-Party Hauler)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>From Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yard">Five-S Yard - Baton Rouge</SelectItem>
                      <SelectItem value="la-2847">LA-2847 Highway Expansion</SelectItem>
                      <SelectItem value="tx-1156">TX-1156 Port Dredging</SelectItem>
                      <SelectItem value="la-3321">LA-3321 Levee Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yard">Five-S Yard - Baton Rouge</SelectItem>
                      <SelectItem value="la-2847">LA-2847 Highway Expansion</SelectItem>
                      <SelectItem value="tx-1156">TX-1156 Port Dredging</SelectItem>
                      <SelectItem value="la-3321">LA-3321 Levee Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Needed By Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Miles</Label>
                  <Input type="number" placeholder="Enter miles" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Special Requirements</Label>
                  <Textarea placeholder="Oversize permits, pilot car required, access restrictions, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewHaulOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingHauls.length}</p>
            <p className="text-xs text-gray-500">Awaiting scheduling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inProgressHauls.length}</p>
            <p className="text-xs text-gray-500">Scheduled or in transit</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              Unbilled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{completedUnbilled.length}</p>
            <p className="text-xs text-gray-500">Delivered, needs billing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{haulRequests.length}</p>
            <p className="text-xs text-gray-500">Total haul requests</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${haulRequests.reduce((sum, h) => sum + (h.actualCost || h.estimatedCost), 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Post to Vista Modal */}
      <Dialog open={billingOpen} onOpenChange={setBillingOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Haul Billing to Vista</DialogTitle>
            <DialogDescription>
              {selectedHaul?.equipmentName} • {selectedHaul?.fromLocation} → {selectedHaul?.toLocation}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment:</span>
                <span className="font-medium">{selectedHaul?.equipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Haul Cost:</span>
                <span className="font-medium">
                  ${(selectedHaul?.actualCost || selectedHaul?.estimatedCost)?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Number to Bill</Label>
              <Input placeholder="e.g., 2847-001" defaultValue={selectedHaul?.toJobCode} />
            </div>
            <div className="space-y-2">
              <Label>Phase Code</Label>
              <Input placeholder="e.g., 01" />
            </div>
            <div className="space-y-2">
              <Label>Cost Type</Label>
              <Select defaultValue="equipment">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="hauling">Hauling</SelectItem>
                  <SelectItem value="mobilization">Mobilization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional billing notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBillingOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Check className="w-4 h-4 mr-2" />
              Post to Vista EM Usage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transport-log">Transport Log</TabsTrigger>
          <TabsTrigger value="pending-billing">Pending Billing</TabsTrigger>
          <TabsTrigger value="internal-hauls">Internal Hauls</TabsTrigger>
          <TabsTrigger value="external-hauls">External Hauls</TabsTrigger>
        </TabsList>

        {/* Transport Log Tab */}
        <TabsContent value="transport-log" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Equipment Transport Log</CardTitle>
                  <CardDescription>All equipment haul requests and movements</CardDescription>
                </div>
                <Button variant="outline">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Driver/Vendor</TableHead>
                    <TableHead>Needed By</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {haulRequests.map((haul) => (
                    <TableRow key={haul.id}>
                      <TableCell className="font-mono text-sm">{haul.requestId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{haul.equipmentName}</p>
                          <p className="text-xs text-gray-500">{haul.equipmentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{haul.fromLocation}</p>
                          <p className="text-gray-500">→ {haul.toLocation}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={haul.haulType === "internal" ? "outline" : "secondary"}>
                          {haul.haulType === "internal" ? "Internal" : "External"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {haul.haulType === "internal" ? (
                          <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-blue-500" />
                            <span className="text-sm">{haul.driver || "Unassigned"}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-purple-500" />
                            <span className="text-sm">{haul.vendor || "Pending quotes"}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{haul.neededBy}</TableCell>
                      <TableCell className="text-right font-mono">${haul.estimatedCost.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(haul.status)}</TableCell>
                      <TableCell>
                        {haul.status === "delivered" && !haul.billingCode && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedHaul(haul)
                              setBillingOpen(true)
                            }}
                          >
                            Post Billing
                          </Button>
                        )}
                        {haul.status === "pending" && (
                          <Button variant="outline" size="sm">
                            Schedule
                          </Button>
                        )}
                        {haul.status === "billed" && <Badge className="bg-green-100 text-green-800">Billed</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Billing Tab */}
        <TabsContent value="pending-billing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hauls Pending Billing</CardTitle>
                  <CardDescription>Delivered hauls awaiting Vista posting</CardDescription>
                </div>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Batch Post to Vista
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {completedUnbilled.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Destination Job</TableHead>
                      <TableHead className="text-right">Haul Cost</TableHead>
                      <TableHead>Job Code</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Cost Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedUnbilled.map((haul) => (
                      <TableRow key={haul.id}>
                        <TableCell className="font-mono">{haul.requestId}</TableCell>
                        <TableCell>{haul.equipmentName}</TableCell>
                        <TableCell>{haul.toLocation}</TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          ${(haul.actualCost || haul.estimatedCost).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Input className="w-24 h-8" placeholder="Job #" defaultValue={haul.toJobCode} />
                        </TableCell>
                        <TableCell>
                          <Input className="w-16 h-8" placeholder="Phase" />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="hauling">
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hauling">Hauling</SelectItem>
                              <SelectItem value="mobilization">Mobilization</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedHaul(haul)
                              setBillingOpen(true)
                            }}
                          >
                            Post
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Check className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p>All hauls have been billed!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internal/External tabs */}
        <TabsContent value="internal-hauls">
          <Card>
            <CardHeader>
              <CardTitle>Internal Hauls (Five-S Drivers)</CardTitle>
              <CardDescription>Equipment moves using company lowboy and drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Miles</TableHead>
                    <TableHead className="text-right">Cost to Bill</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {haulRequests
                    .filter((h) => h.haulType === "internal")
                    .map((haul) => (
                      <TableRow key={haul.id}>
                        <TableCell className="font-medium">{haul.equipmentName}</TableCell>
                        <TableCell>
                          {haul.fromLocation} → {haul.toLocation}
                        </TableCell>
                        <TableCell>{haul.driver || "Unassigned"}</TableCell>
                        <TableCell>{haul.estimatedMiles} mi</TableCell>
                        <TableCell className="text-right font-mono">${haul.estimatedCost.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(haul.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external-hauls">
          <Card>
            <CardHeader>
              <CardTitle>External Hauls (Third-Party)</CardTitle>
              <CardDescription>Equipment moves using contracted hauling vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>PO #</TableHead>
                    <TableHead className="text-right">Quoted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {haulRequests
                    .filter((h) => h.haulType === "external")
                    .map((haul) => (
                      <TableRow key={haul.id}>
                        <TableCell className="font-medium">{haul.equipmentName}</TableCell>
                        <TableCell>
                          {haul.fromLocation} → {haul.toLocation}
                        </TableCell>
                        <TableCell>{haul.vendor || <Badge variant="outline">Pending Quotes</Badge>}</TableCell>
                        <TableCell className="font-mono">{haul.poNumber || "-"}</TableCell>
                        <TableCell className="text-right font-mono">${haul.estimatedCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">
                          {haul.actualCost ? `$${haul.actualCost.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(haul.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
