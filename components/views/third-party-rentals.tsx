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
  AlertCircle,
  Building2,
  Check,
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Phone,
  Plus,
  Send,
  Truck,
  Upload,
  X,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Third-Party Rental Workflow (Five-S):
// 1. PM requests equipment not available in company fleet
// 2. Coordinator gets 3 vendor quotes
// 3. Best quote sent to PM for approval
// 4. PO issued via Rental Tracker
// 5. Track rental until off-rent

interface VendorQuote {
  id: string
  vendor: string
  equipmentType: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  deliveryFee: number
  pickupFee: number
  fuelCharge: string
  damageWaiver: number
  totalEstimate: number
  leadTime: string
  terms: string
  selected: boolean
}

interface ThirdPartyRental {
  id: string
  poNumber: string
  vendor: string
  equipmentType: string
  equipmentId: string
  jobsite: string
  jobCode: string
  requestedBy: string
  approvedBy: string
  startDate: string
  expectedEndDate: string
  actualEndDate: string | null
  dailyRate: number
  totalCost: number
  status:
    | "pending-quotes"
    | "pending-approval"
    | "approved"
    | "on-rent"
    | "off-rent-requested"
    | "returned"
    | "invoiced"
  photos: string[]
  notes: string
}

const sampleQuotes: VendorQuote[] = [
  {
    id: "Q1",
    vendor: "United Rentals",
    equipmentType: "CAT 320 Excavator",
    dailyRate: 1250,
    weeklyRate: 4500,
    monthlyRate: 12500,
    deliveryFee: 850,
    pickupFee: 850,
    fuelCharge: "Customer provides",
    damageWaiver: 125,
    totalEstimate: 14325,
    leadTime: "Next day",
    terms: "Net 30",
    selected: false,
  },
  {
    id: "Q2",
    vendor: "Sunbelt Rentals",
    equipmentType: "CAT 320 Excavator",
    dailyRate: 1175,
    weeklyRate: 4200,
    monthlyRate: 11800,
    deliveryFee: 750,
    pickupFee: 750,
    fuelCharge: "Customer provides",
    damageWaiver: 118,
    totalEstimate: 13418,
    leadTime: "2-3 days",
    terms: "Net 30",
    selected: true,
  },
  {
    id: "Q3",
    vendor: "H&E Equipment",
    equipmentType: "CAT 320 Excavator",
    dailyRate: 1300,
    weeklyRate: 4750,
    monthlyRate: 13200,
    deliveryFee: 900,
    pickupFee: 900,
    fuelCharge: "$50/day if provided",
    damageWaiver: 132,
    totalEstimate: 15132,
    leadTime: "Same day",
    terms: "Net 15",
    selected: false,
  },
]

const activeRentals: ThirdPartyRental[] = [
  {
    id: "TPR-001",
    poNumber: "PO-2025-1247",
    vendor: "Sunbelt Rentals",
    equipmentType: "CAT 320 Excavator",
    equipmentId: "SB-EX-4521",
    jobsite: "LA-2847 Highway Expansion",
    jobCode: "2847-001",
    requestedBy: "Mike Johnson",
    approvedBy: "Trey Folk",
    startDate: "2025-12-01",
    expectedEndDate: "2025-12-31",
    actualEndDate: null,
    dailyRate: 1175,
    totalCost: 14100,
    status: "on-rent",
    photos: [],
    notes: "",
  },
  {
    id: "TPR-002",
    poNumber: "PO-2025-1252",
    vendor: "United Rentals",
    equipmentType: "Komatsu D65 Dozer",
    equipmentId: "UR-DZ-8834",
    jobsite: "TX-1156 Port Dredging",
    jobCode: "1156-003",
    requestedBy: "Sarah Mitchell",
    approvedBy: "Trey Folk",
    startDate: "2025-12-05",
    expectedEndDate: "2025-12-20",
    actualEndDate: null,
    dailyRate: 1450,
    totalCost: 21750,
    status: "off-rent-requested",
    photos: [],
    notes: "PM submitted off-rent form 12/11",
  },
  {
    id: "TPR-003",
    poNumber: "PO-2025-1198",
    vendor: "H&E Equipment",
    equipmentType: "Grove RT880E Crane",
    equipmentId: "HE-CR-2201",
    jobsite: "LA-3321 Levee Repair",
    jobCode: "3321-002",
    requestedBy: "Tom Anderson",
    approvedBy: "Trey Folk",
    startDate: "2025-11-15",
    expectedEndDate: "2025-12-10",
    actualEndDate: "2025-12-08",
    dailyRate: 2800,
    totalCost: 64400,
    status: "returned",
    photos: ["photo1.jpg", "photo2.jpg"],
    notes: "Returned in good condition",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending-quotes":
      return <Badge className="bg-gray-100 text-gray-800">Pending Quotes</Badge>
    case "pending-approval":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
    case "approved":
      return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
    case "on-rent":
      return <Badge className="bg-green-100 text-green-800">On Rent</Badge>
    case "off-rent-requested":
      return <Badge className="bg-orange-100 text-orange-800">Off-Rent Requested</Badge>
    case "returned":
      return <Badge className="bg-purple-100 text-purple-800">Returned</Badge>
    case "invoiced":
      return <Badge className="bg-teal-100 text-teal-800">Invoiced</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ThirdPartyRentalManagement() {
  const [activeTab, setActiveTab] = useState("active-rentals")
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [quoteCompareOpen, setQuoteCompareOpen] = useState(false)
  const [offRentOpen, setOffRentOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<ThirdPartyRental | null>(null)

  const onRentCount = activeRentals.filter((r) => r.status === "on-rent").length
  const pendingOffRent = activeRentals.filter((r) => r.status === "off-rent-requested").length
  const totalMonthlySpend = activeRentals
    .filter((r) => r.status === "on-rent" || r.status === "off-rent-requested")
    .reduce((sum, r) => sum + r.totalCost, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Third-Party Rental Management</h1>
          <p className="text-gray-500">Manage external equipment rentals, vendor quotes, and PO tracking</p>
        </div>
        <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Rental Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Third-Party Rental Request</DialogTitle>
              <DialogDescription>Request equipment when company-owned is not available</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Equipment Type Needed</Label>
                <Input placeholder="e.g., CAT 320 Excavator" />
              </div>
              <div className="space-y-2">
                <Label>Jobsite</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jobsite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="la-2847">LA-2847 Highway Expansion</SelectItem>
                    <SelectItem value="tx-1156">TX-1156 Port Dredging</SelectItem>
                    <SelectItem value="la-3321">LA-3321 Levee Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Required Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Expected Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="2-months">2+ Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Justification (Why company-owned not available)</Label>
                <Textarea placeholder="All company excavators currently deployed. Need additional unit for Phase 2 work starting next week." />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Special Requirements</Label>
                <Textarea placeholder="Any specific attachments, certifications, or delivery requirements" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewRequestOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setNewRequestOpen(false)
                  setQuoteCompareOpen(true)
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Request Quotes from Vendors
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Off-Rent Alert */}
      {pendingOffRent > 0 && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Off-Rent Requests Pending</AlertTitle>
          <AlertDescription className="text-orange-700">
            {pendingOffRent} equipment items have off-rent requests waiting for vendor pickup coordination
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-500" />
              Currently On Rent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{onRentCount}</p>
            <p className="text-xs text-gray-500">Active third-party rentals</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Pending Off-Rent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{pendingOffRent}</p>
            <p className="text-xs text-gray-500">Awaiting vendor pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              Monthly Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalMonthlySpend.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Current month rentals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500" />
              Active Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-gray-500">United, Sunbelt, H&E</p>
          </CardContent>
        </Card>
      </div>

      {/* Quote Comparison Modal */}
      <Dialog open={quoteCompareOpen} onOpenChange={setQuoteCompareOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Quote Comparison</DialogTitle>
            <DialogDescription>Compare quotes from 3 vendors for CAT 320 Excavator • 1 Month Rental</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {sampleQuotes.map((quote) => (
              <Card
                key={quote.id}
                className={`relative ${quote.selected ? "border-2 border-green-500 bg-green-50" : ""}`}
              >
                {quote.selected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{quote.vendor}</CardTitle>
                  <CardDescription>{quote.equipmentType}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Rate:</span>
                      <span className="font-mono">${quote.dailyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekly Rate:</span>
                      <span className="font-mono">${quote.weeklyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-700">Monthly Rate:</span>
                      <span className="font-mono">${quote.monthlyRate.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Delivery:</span>
                        <span>${quote.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Pickup:</span>
                        <span>${quote.pickupFee}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Damage Waiver:</span>
                        <span>${quote.damageWaiver}/day</span>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Lead Time:</span>
                        <span>{quote.leadTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Terms:</span>
                        <span>{quote.terms}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Estimate:</span>
                        <span className={quote.selected ? "text-green-600" : ""}>
                          ${quote.totalEstimate.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant={quote.selected ? "default" : "outline"} className="w-full" size="sm">
                    {quote.selected ? "Selected" : "Select Quote"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-green-800">Recommended: Sunbelt Rentals</p>
                <p className="text-sm text-green-600">Lowest total cost, acceptable lead time</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Savings vs. highest quote:</p>
                <p className="text-xl font-bold text-green-600">$1,714</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteCompareOpen(false)}>
              Back
            </Button>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Send to PM for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Off-Rent Modal */}
      <Dialog open={offRentOpen} onOpenChange={setOffRentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Off-Rent Request</DialogTitle>
            <DialogDescription>
              {selectedRental?.equipmentType} • {selectedRental?.vendor}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Off-Rent Checklist</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" /> Off-rent form received from PM
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" /> Condition photos uploaded
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-yellow-500" /> Vendor notified for pickup
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-3 h-3 text-gray-300" /> Pickup confirmed
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Vendor Contact</Label>
              <div className="flex gap-2">
                <Input value="Sunbelt Rentals - (225) 555-0142" disabled className="flex-1" />
                <Button variant="outline" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pickup Date Requested</Label>
              <Input type="date" defaultValue="2025-12-13" />
            </div>
            <div className="space-y-2">
              <Label>Site Contact for Pickup</Label>
              <Input placeholder="Name and phone number" />
            </div>
            <div className="space-y-2">
              <Label>Condition Notes</Label>
              <Textarea placeholder="Any damage, issues, or notes for vendor" />
            </div>
            <div className="space-y-2">
              <Label>Condition Photos</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drop photos here or click to upload</p>
                <p className="text-xs text-gray-400">Required for damage protection</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOffRentOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Check className="w-4 h-4 mr-2" />
              Confirm Vendor Notified
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active-rentals">Active Rentals</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="rental-history">Rental History</TabsTrigger>
          <TabsTrigger value="po-tracker">PO Tracker</TabsTrigger>
        </TabsList>

        {/* Active Rentals Tab */}
        <TabsContent value="active-rentals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Third-Party Rentals</CardTitle>
              <CardDescription>Equipment currently on rent from external vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Jobsite</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expected End</TableHead>
                    <TableHead className="text-right">Daily Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRentals
                    .filter((r) => r.status === "on-rent" || r.status === "off-rent-requested")
                    .map((rental) => (
                      <TableRow
                        key={rental.id}
                        className={rental.status === "off-rent-requested" ? "bg-orange-50" : ""}
                      >
                        <TableCell className="font-mono text-sm">{rental.poNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rental.equipmentType}</p>
                            <p className="text-xs text-gray-500">{rental.equipmentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{rental.vendor}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{rental.jobsite}</p>
                            <p className="text-xs text-gray-500">{rental.jobCode}</p>
                          </div>
                        </TableCell>
                        <TableCell>{rental.startDate}</TableCell>
                        <TableCell>{rental.expectedEndDate}</TableCell>
                        <TableCell className="text-right font-mono">${rental.dailyRate.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(rental.status)}</TableCell>
                        <TableCell>
                          {rental.status === "on-rent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRental(rental)
                                setOffRentOpen(true)
                              }}
                            >
                              Request Off-Rent
                            </Button>
                          )}
                          {rental.status === "off-rent-requested" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRental(rental)
                                setOffRentOpen(true)
                              }}
                            >
                              Process Off-Rent
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rental History Tab */}
        <TabsContent value="rental-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Completed third-party rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Jobsite</TableHead>
                    <TableHead>Rental Period</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead>Photos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRentals
                    .filter((r) => r.status === "returned" || r.status === "invoiced")
                    .map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-mono text-sm">{rental.poNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rental.equipmentType}</p>
                            <p className="text-xs text-gray-500">{rental.equipmentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{rental.vendor}</TableCell>
                        <TableCell>{rental.jobsite}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{rental.startDate}</p>
                            <p className="text-gray-500">to {rental.actualEndDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          ${rental.totalCost.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {rental.photos.length > 0 ? (
                            <Button variant="ghost" size="sm">
                              <ImageIcon className="w-4 h-4 mr-1" />
                              {rental.photos.length}
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(rental.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PO Tracker Tab */}
        <TabsContent value="po-tracker" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Rental PO Tracker</CardTitle>
                  <CardDescription>All purchase orders for third-party equipment rentals</CardDescription>
                </div>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Job Code</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Off-Rent Date</TableHead>
                    <TableHead className="text-right">Estimated Cost</TableHead>
                    <TableHead className="text-right">Actual Cost</TableHead>
                    <TableHead>Invoice Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-mono font-medium">{rental.poNumber}</TableCell>
                      <TableCell>{rental.vendor}</TableCell>
                      <TableCell>{rental.equipmentType}</TableCell>
                      <TableCell className="font-mono text-sm">{rental.jobCode}</TableCell>
                      <TableCell>{rental.startDate}</TableCell>
                      <TableCell>{rental.actualEndDate || "-"}</TableCell>
                      <TableCell className="text-right font-mono">${rental.totalCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">
                        {rental.status === "invoiced" ? `$${rental.totalCost.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        {rental.status === "invoiced" ? (
                          <Badge className="bg-green-100 text-green-800">Invoiced</Badge>
                        ) : rental.status === "returned" ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Awaiting Invoice</Badge>
                        ) : (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-approval">
          <Card>
            <CardContent className="py-8 text-center text-gray-500">No rental requests pending approval</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
