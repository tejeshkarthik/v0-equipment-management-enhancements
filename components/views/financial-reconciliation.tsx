"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle, DollarSign, FileText, TrendingDown, TrendingUp, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RMItem {
  id: string
  equipmentId: string
  equipmentName: string
  ytdCost: number
  budgetedCost: number
  variance: number
  variancePercent: number
  lastMonthCost: number
  trend: "up" | "down" | "stable"
}

interface DamageItem {
  id: string
  equipmentId: string
  equipmentName: string
  damageDate: string
  description: string
  costCode: string
  repairCost: number
  responsibleParty: string
  recoveryStatus: "pending" | "invoiced" | "collected"
}

const rmData: RMItem[] = [
  {
    id: "1",
    equipmentId: "EX-1045",
    equipmentName: "CAT 336 Excavator",
    ytdCost: 45820,
    budgetedCost: 38000,
    variance: 7820,
    variancePercent: 20.6,
    lastMonthCost: 4200,
    trend: "up",
  },
  {
    id: "2",
    equipmentId: "BD-2013",
    equipmentName: "CAT D8T Bulldozer",
    ytdCost: 38450,
    budgetedCost: 42000,
    variance: -3550,
    variancePercent: -8.5,
    lastMonthCost: 3100,
    trend: "down",
  },
  {
    id: "3",
    equipmentId: "CR-3301",
    equipmentName: "Grove TMS900E Crane",
    ytdCost: 52300,
    budgetedCost: 45000,
    variance: 7300,
    variancePercent: 16.2,
    lastMonthCost: 5800,
    trend: "up",
  },
]

const damageData: DamageItem[] = [
  {
    id: "1",
    equipmentId: "EX-1045",
    equipmentName: "CAT 336 Excavator",
    damageDate: "2025-11-15",
    description: "Hydraulic line damaged by operator error",
    costCode: "400",
    repairCost: 3850,
    responsibleParty: "Acme Construction",
    recoveryStatus: "pending",
  },
  {
    id: "2",
    equipmentId: "TK-5102",
    equipmentName: "Kenworth T800 Dump Truck",
    damageDate: "2025-11-22",
    description: "Collision damage to front bumper",
    costCode: "400",
    repairCost: 2400,
    responsibleParty: "Project Manager - Johnson Site",
    recoveryStatus: "pending",
  },
]

const getBadgeColor = (bu: string) => {
  if (bu === "FSG") return "bg-blue-100 text-blue-800"
  if (bu === "FSM") return "bg-teal-100 text-teal-800"
  if (bu === "FSE") return "bg-orange-100 text-orange-800"
  return "bg-gray-100 text-gray-800"
}

export default function FinancialReconciliation() {
  const [activeTab, setActiveTab] = useState("monthly-review")
  const [reclassModalOpen, setReclassModalOpen] = useState(false)

  const highVarianceCount = rmData.filter((item) => Math.abs(item.variancePercent) > 15).length
  const pendingRecovery = damageData.filter((item) => item.recoveryStatus === "pending").length
  const totalRecoveryAmount = damageData
    .filter((item) => item.recoveryStatus === "pending")
    .reduce((sum, item) => sum + item.repairCost, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reconciliation</h1>
          <p className="text-gray-500">Monthly reviews, damage recoupment, and cost adjustments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={reclassModalOpen} onOpenChange={setReclassModalOpen}>
            <DialogTrigger asChild>
              <Button>Create Cost Adjustment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cost Adjustment / Reclass Request</DialogTitle>
                <DialogDescription>Request a correction to equipment cost posting</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Original Posting</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Equipment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EX-1045">CAT 336 Excavator</SelectItem>
                          <SelectItem value="BD-2013">CAT D8T Bulldozer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Original Amount</Label>
                      <Input type="number" placeholder="$" />
                    </div>
                    <div className="space-y-2">
                      <Label>Original Job Code</Label>
                      <Input placeholder="e.g., 2025-045" />
                    </div>
                    <div className="space-y-2">
                      <Label>Original Phase</Label>
                      <Input placeholder="e.g., 100" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-3 text-blue-900">Corrected Posting</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Correct Job Code</Label>
                      <Input placeholder="e.g., 2025-052" />
                    </div>
                    <div className="space-y-2">
                      <Label>Correct Phase</Label>
                      <Input placeholder="e.g., 200" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Reason for Correction</Label>
                      <Textarea placeholder="Explain why this adjustment is needed..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Approval Workflow</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline">PC/PM Review</Badge>
                    <span className="text-gray-400">→</span>
                    <Badge variant="outline">Controller Approval</Badge>
                    <span className="text-gray-400">→</span>
                    <Badge variant="outline">Vista Posting</Badge>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReclassModalOpen(false)}>
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

      {/* Alert for high variance items */}
      {highVarianceCount > 0 && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">High Variance Alert</AlertTitle>
          <AlertDescription className="text-orange-700">
            {highVarianceCount} equipment items have variances exceeding 15% from budget
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Over Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{rmData.filter((r) => r.variance > 0).length}</p>
            <p className="text-xs text-gray-500">Equipment items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              Under Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{rmData.filter((r) => r.variance < 0).length}</p>
            <p className="text-xs text-gray-500">Equipment items</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              Pending Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendingRecovery}</p>
            <p className="text-xs text-gray-500">Damage items</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Recovery Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${totalRecoveryAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">To be collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monthly-review">Monthly R&M Review</TabsTrigger>
          <TabsTrigger value="damage-recovery">Damage Recoupment</TabsTrigger>
          <TabsTrigger value="adjustments">Cost Adjustments</TabsTrigger>
        </TabsList>

        {/* Monthly Review Tab */}
        <TabsContent value="monthly-review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 15 R&M Items - December 2025</CardTitle>
              <CardDescription>Equipment with highest repair & maintenance costs YTD</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead className="text-right">YTD Cost</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                    <TableHead className="text-right">Last Month</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rmData.map((item, idx) => (
                    <TableRow key={item.id} className={Math.abs(item.variancePercent) > 15 ? "bg-orange-50" : ""}>
                      <TableCell className="font-medium">#{idx + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.equipmentName}</p>
                          <p className="text-xs text-gray-500">{item.equipmentId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">${item.ytdCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${item.budgetedCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.variance > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                          {item.variance > 0 ? "+" : ""}${Math.abs(item.variance).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            Math.abs(item.variancePercent) > 15
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.variance > 0 ? "+" : ""}
                          {item.variancePercent.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">${item.lastMonthCost.toLocaleString()}</TableCell>
                      <TableCell>
                        {item.trend === "up" && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {item.trend === "down" && <TrendingDown className="w-4 h-4 text-green-500" />}
                        {item.trend === "stable" && <span className="text-gray-400">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Damage Recovery Tab */}
        <TabsContent value="damage-recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Damage Recoupment - Cost Code 400</CardTitle>
                  <CardDescription>Equipment damages requiring billing to responsible parties</CardDescription>
                </div>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Invoices
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Damage Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Cost Code</TableHead>
                    <TableHead className="text-right">Repair Cost</TableHead>
                    <TableHead>Responsible Party</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {damageData.map((item) => (
                    <TableRow key={item.id} className="bg-yellow-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.equipmentName}</p>
                          <p className="text-xs text-gray-500">{item.equipmentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(item.damageDate).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs">{item.description}</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">{item.costCode}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">${item.repairCost.toLocaleString()}</TableCell>
                      <TableCell>{item.responsibleParty}</TableCell>
                      <TableCell>
                        {item.recoveryStatus === "pending" && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            Pending Invoice
                          </Badge>
                        )}
                        {item.recoveryStatus === "invoiced" && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Invoiced
                          </Badge>
                        )}
                        {item.recoveryStatus === "collected" && (
                          <Badge className="bg-green-100 text-green-800">Collected</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.recoveryStatus === "pending" && (
                          <Button size="sm" variant="outline">
                            Create Invoice
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

        {/* Adjustments Tab */}
        <TabsContent value="adjustments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Adjustment Queue</CardTitle>
              <CardDescription>Pending corrections and reclassifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No pending cost adjustments</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setReclassModalOpen(true)}>
                  Create New Adjustment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
