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
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  Archive,
  CheckCircle,
  DollarSign,
  FileText,
  Send,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Five-S Disposal Workflow:
// 1. Quarterly review identifies disposal candidates (R&M >12%)
// 2. Create disposal plan, review with leadership
// 3. Move assets out of fleet
// 4. Complete Disposal Form & Calculation (gain/loss)
// 5. Remove from: Vista, INCAS, Insurance, Master List
// 6. Remove GPS trackers and stickers

interface DisposalCandidate {
  id: string
  assetId: string
  assetName: string
  category: string
  age: number
  originalCost: number
  currentValue: number
  rmCostYTD: number
  rmPercentage: number
  utilizationRate: number
  recommendation: "dispose" | "repair" | "keep"
  status: "evaluation" | "approved" | "pending-sale" | "sold" | "removed"
  notes: string
}

interface CapexRequest {
  id: string
  requestId: string
  equipmentType: string
  justification: string
  requestedBy: string
  vendor1: { name: string; price: number; leadTime: string }
  vendor2: { name: string; price: number; leadTime: string }
  vendor3: { name: string; price: number; leadTime: string }
  selectedVendor: string | null
  estimatedROI: number
  projectedMonthlyRevenue: number
  status: "draft" | "pending-quotes" | "pending-approval" | "approved" | "ordered" | "received"
  approvals: { svp: boolean; ceo: boolean }
  createdDate: string
}

const disposalCandidates: DisposalCandidate[] = [
  {
    id: "DC001",
    assetId: "EQ-1847",
    assetName: "CAT 320D Excavator",
    category: "Excavators",
    age: 12,
    originalCost: 285000,
    currentValue: 45000,
    rmCostYTD: 42000,
    rmPercentage: 14.7,
    utilizationRate: 62,
    recommendation: "dispose",
    status: "approved",
    notes: "High R&M, below avg utilization",
  },
  {
    id: "DC002",
    assetId: "EQ-2156",
    assetName: "Komatsu D51 Dozer",
    category: "Dozers",
    age: 8,
    originalCost: 195000,
    currentValue: 78000,
    rmCostYTD: 28500,
    rmPercentage: 14.6,
    utilizationRate: 71,
    recommendation: "repair",
    status: "evaluation",
    notes: "Undercarriage replacement needed, otherwise good",
  },
  {
    id: "DC003",
    assetId: "EQ-0892",
    assetName: "Volvo A30 Haul Truck",
    category: "Off-Road Trucks",
    age: 15,
    originalCost: 320000,
    currentValue: 28000,
    rmCostYTD: 51000,
    rmPercentage: 15.9,
    utilizationRate: 45,
    recommendation: "dispose",
    status: "pending-sale",
    notes: "Listed on auction site",
  },
  {
    id: "DC004",
    assetId: "EQ-3421",
    assetName: "JD 544K Loader",
    category: "Loaders",
    age: 6,
    originalCost: 165000,
    currentValue: 95000,
    rmCostYTD: 12500,
    rmPercentage: 7.6,
    utilizationRate: 85,
    recommendation: "keep",
    status: "evaluation",
    notes: "Good condition, high utilization",
  },
]

const capexRequests: CapexRequest[] = [
  {
    id: "CAP001",
    requestId: "CAPEX-2025-047",
    equipmentType: "CAT 336 Excavator",
    justification: "Replace aging EQ-1847, support LA-2847 Phase 2 work",
    requestedBy: "Lindsey Thurmon",
    vendor1: { name: "Louisiana CAT", price: 485000, leadTime: "8-10 weeks" },
    vendor2: { name: "Mustang CAT", price: 492000, leadTime: "6-8 weeks" },
    vendor3: { name: "Blanchard Equipment", price: 478500, leadTime: "10-12 weeks" },
    selectedVendor: "Blanchard Equipment",
    estimatedROI: 24,
    projectedMonthlyRevenue: 18500,
    status: "pending-approval",
    approvals: { svp: true, ceo: false },
    createdDate: "2025-12-08",
  },
  {
    id: "CAP002",
    requestId: "CAPEX-2025-048",
    equipmentType: "Komatsu D65 Dozer",
    justification: "Fleet expansion for TX-1156 project requirements",
    requestedBy: "Equipment Team",
    vendor1: { name: "Kirby-Smith", price: 425000, leadTime: "4-6 weeks" },
    vendor2: { name: "Road Machinery", price: 418000, leadTime: "6-8 weeks" },
    vendor3: { name: "?"[0] === "?" ? "Pending" : "", price: 0, leadTime: "TBD" },
    selectedVendor: null,
    estimatedROI: 0,
    projectedMonthlyRevenue: 0,
    status: "pending-quotes",
    approvals: { svp: false, ceo: false },
    createdDate: "2025-12-10",
  },
]

const getRecommendationBadge = (rec: string) => {
  switch (rec) {
    case "dispose":
      return <Badge className="bg-red-100 text-red-800">Dispose</Badge>
    case "repair":
      return <Badge className="bg-yellow-100 text-yellow-800">Repair</Badge>
    case "keep":
      return <Badge className="bg-green-100 text-green-800">Keep</Badge>
    default:
      return <Badge variant="outline">{rec}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "evaluation":
      return <Badge className="bg-blue-100 text-blue-800">Under Evaluation</Badge>
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Approved for Disposal</Badge>
    case "pending-sale":
      return <Badge className="bg-purple-100 text-purple-800">Pending Sale</Badge>
    case "sold":
      return <Badge className="bg-teal-100 text-teal-800">Sold</Badge>
    case "removed":
      return <Badge className="bg-gray-100 text-gray-800">Removed from Systems</Badge>
    case "pending-quotes":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Quotes</Badge>
    case "pending-approval":
      return <Badge className="bg-orange-100 text-orange-800">Pending Approval</Badge>
    case "ordered":
      return <Badge className="bg-blue-100 text-blue-800">Ordered</Badge>
    case "received":
      return <Badge className="bg-green-100 text-green-800">Received</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function AssetDisposalLifecycle() {
  const [activeTab, setActiveTab] = useState("quarterly-review")
  const [disposalFormOpen, setDisposalFormOpen] = useState(false)
  const [capexFormOpen, setCapexFormOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<DisposalCandidate | null>(null)

  const disposeCount = disposalCandidates.filter((d) => d.recommendation === "dispose").length
  const highRmCount = disposalCandidates.filter((d) => d.rmPercentage > 12).length
  const pendingApprovals = capexRequests.filter((c) => c.status === "pending-approval").length

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Lifecycle Management</h1>
          <p className="text-gray-500">Quarterly evaluation, disposal process, and CAPEX acquisition</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={capexFormOpen} onOpenChange={setCapexFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <ShoppingCart className="w-4 h-4 mr-2" />
                New CAPEX Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Equipment Acquisition (CAPEX)</DialogTitle>
                <DialogDescription>Request new equipment purchase with vendor quotes</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2">
                  <Label>Equipment Type</Label>
                  <Input placeholder="e.g., CAT 336 Excavator" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Justification</Label>
                  <Textarea placeholder="Why is this equipment needed? Replacement, expansion, project requirement?" />
                </div>
                <div className="col-span-2">
                  <Label className="mb-2 block">Vendor Quotes (Minimum 3 Required)</Label>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="grid grid-cols-3 gap-2">
                        <Input placeholder={`Vendor ${i} name`} />
                        <Input placeholder="Price" type="number" />
                        <Input placeholder="Lead time" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Estimated Monthly Revenue</Label>
                  <Input type="number" placeholder="$" />
                </div>
                <div className="space-y-2">
                  <Label>Target ROI (months)</Label>
                  <Input type="number" placeholder="24" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCapexFormOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alert for high R&M equipment */}
      {highRmCount > 0 && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Quarterly Review Alert</AlertTitle>
          <AlertDescription className="text-orange-700">
            {highRmCount} equipment items have R&M costs exceeding 12% threshold and require evaluation
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              High R&M (&gt;12%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{highRmCount}</p>
            <p className="text-xs text-gray-500">Requires evaluation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-orange-500" />
              Recommended Disposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{disposeCount}</p>
            <p className="text-xs text-gray-500">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Archive className="w-4 h-4 text-purple-500" />
              Pending Sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{disposalCandidates.filter((d) => d.status === "pending-sale").length}</p>
            <p className="text-xs text-gray-500">Listed for sale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              CAPEX Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingApprovals}</p>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Est. Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              $
              {disposalCandidates
                .filter((d) => d.recommendation === "dispose")
                .reduce((sum, d) => sum + d.currentValue, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">From disposals</p>
          </CardContent>
        </Card>
      </div>

      {/* Disposal Form Modal */}
      <Dialog open={disposalFormOpen} onOpenChange={setDisposalFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Disposal</DialogTitle>
            <DialogDescription>
              {selectedAsset?.assetName} • {selectedAsset?.assetId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Cost:</span>
                <span>${selectedAsset?.originalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Book Value:</span>
                <span>${selectedAsset?.currentValue.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sale Price</Label>
              <Input type="number" placeholder="Enter sale price" />
            </div>
            <div className="space-y-2">
              <Label>Buyer Information</Label>
              <Input placeholder="Buyer name / Company" />
            </div>
            <div className="space-y-2">
              <Label>Sale Date</Label>
              <Input type="date" />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>System Removal Checklist</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove from Vista (Depreciation)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove from INCAS
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove from Insurance Portal
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove from Master Asset List
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove GPS Tracker
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Remove Company Stickers
                  </label>
                </div>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisposalFormOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Archive className="w-4 h-4 mr-2" />
              Complete Disposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="quarterly-review">Quarterly Evaluation</TabsTrigger>
          <TabsTrigger value="disposal-pipeline">Disposal Pipeline</TabsTrigger>
          <TabsTrigger value="capex-requests">CAPEX Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed Transactions</TabsTrigger>
        </TabsList>

        {/* Quarterly Review Tab */}
        <TabsContent value="quarterly-review" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Q4 2025 Equipment Evaluation</CardTitle>
                  <CardDescription>Equipment flagged for review based on R&M costs and utilization</CardDescription>
                </div>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Age (Yrs)</TableHead>
                    <TableHead className="text-right">Book Value</TableHead>
                    <TableHead className="text-right">R&M YTD</TableHead>
                    <TableHead className="text-right">R&M %</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disposalCandidates.map((asset) => (
                    <TableRow key={asset.id} className={asset.rmPercentage > 12 ? "bg-red-50" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{asset.assetName}</p>
                          <p className="text-xs text-gray-500">{asset.assetId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell className="text-right">{asset.age}</TableCell>
                      <TableCell className="text-right font-mono">${asset.currentValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${asset.rmCostYTD.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={asset.rmPercentage > 12 ? "text-red-600 font-bold" : ""}>
                          {asset.rmPercentage.toFixed(1)}%
                        </span>
                        {asset.rmPercentage > 12 && <TrendingUp className="inline w-3 h-3 ml-1 text-red-500" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={asset.utilizationRate} className="w-16 h-2" />
                          <span className="text-sm">{asset.utilizationRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRecommendationBadge(asset.recommendation)}</TableCell>
                      <TableCell>
                        {asset.recommendation === "dispose" && asset.status === "evaluation" && (
                          <Button size="sm" variant="outline">
                            Approve Disposal
                          </Button>
                        )}
                        {asset.recommendation === "repair" && (
                          <Button size="sm" variant="outline">
                            Create W/O
                          </Button>
                        )}
                        {asset.recommendation === "keep" && (
                          <Badge variant="outline" className="text-green-600">
                            No Action
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disposal Pipeline Tab */}
        <TabsContent value="disposal-pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disposal Pipeline</CardTitle>
              <CardDescription>Track equipment through the disposal process</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Book Value</TableHead>
                    <TableHead className="text-right">Est. Sale Price</TableHead>
                    <TableHead className="text-right">Gain/Loss</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disposalCandidates
                    .filter((d) => d.recommendation === "dispose")
                    .map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{asset.assetName}</p>
                            <p className="text-xs text-gray-500">{asset.assetId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">${asset.currentValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">
                          ${(asset.currentValue * 0.9).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-red-600">-${(asset.currentValue * 0.1).toLocaleString()}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell className="text-sm max-w-48">{asset.notes}</TableCell>
                        <TableCell>
                          {asset.status === "approved" && (
                            <Button size="sm" variant="outline">
                              List for Sale
                            </Button>
                          )}
                          {asset.status === "pending-sale" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAsset(asset)
                                setDisposalFormOpen(true)
                              }}
                            >
                              Complete Sale
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

        {/* CAPEX Requests Tab */}
        <TabsContent value="capex-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CAPEX Acquisition Requests</CardTitle>
              <CardDescription>New equipment purchase requests and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Best Quote</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Est. ROI</TableHead>
                    <TableHead>Approvals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capexRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.requestId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.equipmentType}</p>
                          <p className="text-xs text-gray-500">{request.justification.substring(0, 50)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.selectedVendor || "Pending selection"}</TableCell>
                      <TableCell className="text-right font-mono">
                        {request.selectedVendor
                          ? `$${Math.min(request.vendor1.price, request.vendor2.price, request.vendor3.price || 999999).toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.estimatedROI ? `${request.estimatedROI} mo` : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {request.approvals.svp ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">SVP ✓</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              SVP
                            </Badge>
                          )}
                          {request.approvals.ceo ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">CEO ✓</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              CEO
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === "pending-quotes" && (
                          <Button size="sm" variant="outline">
                            Add Quotes
                          </Button>
                        )}
                        {request.status === "pending-approval" && <Button size="sm">View Details</Button>}
                        {request.status === "approved" && (
                          <Button size="sm" className="bg-green-600">
                            Create PO
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

        <TabsContent value="completed">
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p>No completed transactions this quarter</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
