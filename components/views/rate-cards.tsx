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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  Calculator,
  DollarSign,
  Edit,
  Plus,
  Clock,
  Calendar,
  CalendarDays,
  FileSpreadsheet,
  Send,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Five-S Rate Structure:
// Daily Rate: <40 hours/month
// Weekly Rate: 40-176 hours/month
// Monthly Rate: >176 hours (triggers hourly overage)
// Three rate types: Internal, External Rental, Owner (T&M)

interface RateCard {
  id: string
  equipmentId: string
  equipmentName: string
  category: string
  internalRates: { daily: number; weekly: number; monthly: number; hourly: number }
  externalRates: { daily: number; weekly: number; monthly: number; hourly: number }
  ownerRates: { daily: number; weekly: number; monthly: number; hourly: number }
  lastUpdated: string
  updatedBy: string
}

interface EquipmentUtilization {
  equipmentId: string
  equipmentName: string
  monthlyHours: number
  jobsite: string
  jobCode: string
  bu: "FSG" | "FSM" | "FSE"
  daysOnRent: number
  overageHours: number
  billingStatus: "pending" | "coded" | "billed"
  pcName: string
}

const rateCards: RateCard[] = [
  {
    id: "RC001",
    equipmentId: "EQ-2847",
    equipmentName: "CAT 336 Excavator",
    category: "Excavators",
    internalRates: { daily: 850, weekly: 3400, monthly: 12000, hourly: 85 },
    externalRates: { daily: 1200, weekly: 4800, monthly: 17000, hourly: 120 },
    ownerRates: { daily: 1500, weekly: 6000, monthly: 21000, hourly: 150 },
    lastUpdated: "2025-11-15",
    updatedBy: "Lindsey Thurmon",
  },
  {
    id: "RC002",
    equipmentId: "EQ-1923",
    equipmentName: "Komatsu D65 Dozer",
    category: "Dozers",
    internalRates: { daily: 750, weekly: 3000, monthly: 10500, hourly: 75 },
    externalRates: { daily: 1050, weekly: 4200, monthly: 14700, hourly: 105 },
    ownerRates: { daily: 1300, weekly: 5200, monthly: 18200, hourly: 130 },
    lastUpdated: "2025-10-20",
    updatedBy: "Lindsey Thurmon",
  },
  {
    id: "RC003",
    equipmentId: "EQ-3156",
    equipmentName: "Volvo A40G Haul Truck",
    category: "Off-Road Trucks",
    internalRates: { daily: 650, weekly: 2600, monthly: 9100, hourly: 65 },
    externalRates: { daily: 910, weekly: 3640, monthly: 12740, hourly: 91 },
    ownerRates: { daily: 1100, weekly: 4400, monthly: 15400, hourly: 110 },
    lastUpdated: "2025-11-01",
    updatedBy: "Ashley Roberts",
  },
  {
    id: "RC004",
    equipmentId: "EQ-4521",
    equipmentName: "John Deere 850K Dozer",
    category: "Dozers",
    internalRates: { daily: 780, weekly: 3120, monthly: 10920, hourly: 78 },
    externalRates: { daily: 1090, weekly: 4360, monthly: 15260, hourly: 109 },
    ownerRates: { daily: 1350, weekly: 5400, monthly: 18900, hourly: 135 },
    lastUpdated: "2025-10-28",
    updatedBy: "Lindsey Thurmon",
  },
]

const utilizationData: EquipmentUtilization[] = [
  {
    equipmentId: "EQ-2847",
    equipmentName: "CAT 336 Excavator",
    monthlyHours: 192,
    jobsite: "LA-2847 Highway Expansion",
    jobCode: "2847-001",
    bu: "FSG",
    daysOnRent: 24,
    overageHours: 16,
    billingStatus: "pending",
    pcName: "Sarah Mitchell",
  },
  {
    equipmentId: "EQ-1923",
    equipmentName: "Komatsu D65 Dozer",
    monthlyHours: 156,
    jobsite: "TX-1156 Port Dredging",
    jobCode: "1156-003",
    bu: "FSM",
    daysOnRent: 18,
    overageHours: 0,
    billingStatus: "coded",
    pcName: "Mike Johnson",
  },
  {
    equipmentId: "EQ-3156",
    equipmentName: "Volvo A40G Haul Truck",
    monthlyHours: 35,
    jobsite: "LA-3321 Levee Repair",
    jobCode: "3321-002",
    bu: "FSG",
    daysOnRent: 5,
    overageHours: 0,
    billingStatus: "billed",
    pcName: "Tom Anderson",
  },
  {
    equipmentId: "EQ-4521",
    equipmentName: "John Deere 850K Dozer",
    monthlyHours: 198,
    jobsite: "LA-2847 Highway Expansion",
    jobCode: "2847-001",
    bu: "FSG",
    daysOnRent: 28,
    overageHours: 22,
    billingStatus: "pending",
    pcName: "Sarah Mitchell",
  },
  {
    equipmentId: "EQ-5678",
    equipmentName: "CAT 320 Excavator",
    monthlyHours: 184,
    jobsite: "TX-4455 Bridge Construction",
    jobCode: "4455-001",
    bu: "FSE",
    daysOnRent: 26,
    overageHours: 8,
    billingStatus: "pending",
    pcName: "Lisa Chen",
  },
]

const getBuColor = (bu: string) => {
  switch (bu) {
    case "FSG":
      return "bg-blue-100 text-blue-800"
    case "FSM":
      return "bg-teal-100 text-teal-800"
    case "FSE":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRateThreshold = (hours: number) => {
  if (hours < 40) return { label: "Daily", color: "bg-blue-100 text-blue-800", rate: "daily" }
  if (hours <= 176) return { label: "Weekly", color: "bg-green-100 text-green-800", rate: "weekly" }
  return { label: "Monthly + Overage", color: "bg-orange-100 text-orange-800", rate: "monthly" }
}

const calculateBilling = (hours: number, rateCard: RateCard | undefined) => {
  if (!rateCard) return { amount: 0, breakdown: "" }
  const rates = rateCard.internalRates

  if (hours < 40) {
    const days = Math.ceil(hours / 8)
    return { amount: days * rates.daily, breakdown: `${days} days × $${rates.daily}` }
  } else if (hours <= 176) {
    const weeks = Math.ceil(hours / 40)
    return { amount: weeks * rates.weekly, breakdown: `${weeks} weeks × $${rates.weekly}` }
  } else {
    const overage = hours - 176
    const total = rates.monthly + overage * rates.hourly
    return { amount: total, breakdown: `$${rates.monthly.toLocaleString()} + ${overage}hrs × $${rates.hourly}` }
  }
}

export default function RateCardManagement() {
  const [activeTab, setActiveTab] = useState("utilization")
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [calcEquipment, setCalcEquipment] = useState("")
  const [calcHours, setCalcHours] = useState("")
  const [calcRateType, setCalcRateType] = useState("internal")

  const over176Equipment = utilizationData.filter((e) => e.monthlyHours > 176)
  const pendingBilling = utilizationData.filter((e) => e.billingStatus === "pending")

  const totalBilling = utilizationData.reduce((sum, item) => {
    const rc = rateCards.find((r) => r.equipmentId === item.equipmentId)
    return sum + calculateBilling(item.monthlyHours, rc).amount
  }, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rate Card & Billing Management</h1>
          <p className="text-gray-500">Daily/Weekly/Monthly rates with 176-hour threshold tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Rate Calculator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Billing Rate Calculator</DialogTitle>
                <DialogDescription>Calculate billing based on equipment hours</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <Select value={calcEquipment} onValueChange={setCalcEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {rateCards.map((rc) => (
                        <SelectItem key={rc.id} value={rc.equipmentId}>
                          {rc.equipmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rate Type</Label>
                  <Select value={calcRateType} onValueChange={setCalcRateType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Rate</SelectItem>
                      <SelectItem value="external">External Rental</SelectItem>
                      <SelectItem value="owner">Owner Rate (T&M)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Hours</Label>
                  <Input
                    type="number"
                    value={calcHours}
                    onChange={(e) => setCalcHours(e.target.value)}
                    placeholder="Enter hours"
                  />
                </div>
                {calcEquipment && calcHours && (
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      {(() => {
                        const rc = rateCards.find((r) => r.equipmentId === calcEquipment)
                        const hours = Number(calcHours)
                        const threshold = getRateThreshold(hours)
                        const billing = calculateBilling(hours, rc)
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Rate Applied:</span>
                              <Badge className={threshold.color}>{threshold.label}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Calculation:</span>
                              <span className="font-mono">{billing.breakdown}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                              <span className="font-semibold">Total Billing:</span>
                              <span className="text-2xl font-bold text-green-600">
                                ${billing.amount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Rate Card
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {over176Equipment.length > 0 && (
        <Alert className="border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Over 176 Hours Alert</AlertTitle>
          <AlertDescription className="text-orange-700">
            {over176Equipment.length} equipment items exceeded 176 hours this month — requires monthly rate + hourly
            overage billing
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Daily Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{utilizationData.filter((e) => e.monthlyHours < 40).length}</p>
            <p className="text-xs text-gray-500">&lt;40 hrs/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              Weekly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {utilizationData.filter((e) => e.monthlyHours >= 40 && e.monthlyHours <= 176).length}
            </p>
            <p className="text-xs text-gray-500">40-176 hrs/month</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              Monthly + Overage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{over176Equipment.length}</p>
            <p className="text-xs text-gray-500">&gt;176 hrs/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Pending Coding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendingBilling.length}</p>
            <p className="text-xs text-gray-500">Awaiting PC/PM</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${totalBilling.toLocaleString()}</p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="utilization">Weekly Utilization</TabsTrigger>
          <TabsTrigger value="over176">176hr Threshold Report</TabsTrigger>
          <TabsTrigger value="rate-cards">Rate Cards</TabsTrigger>
          <TabsTrigger value="billing-queue">Billing Queue</TabsTrigger>
        </TabsList>

        {/* Weekly Utilization Tab */}
        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Weekly Utilization Report</CardTitle>
                  <CardDescription>Week of December 9-13, 2025 • Generated Monday 6:00 AM</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send for Coding
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>BU</TableHead>
                    <TableHead>Jobsite</TableHead>
                    <TableHead className="text-right">Monthly Hrs</TableHead>
                    <TableHead>Rate Applied</TableHead>
                    <TableHead className="text-right">Billing</TableHead>
                    <TableHead>PC/PM</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilizationData.map((item) => {
                    const rc = rateCards.find((r) => r.equipmentId === item.equipmentId)
                    const threshold = getRateThreshold(item.monthlyHours)
                    const billing = calculateBilling(item.monthlyHours, rc)
                    return (
                      <TableRow key={item.equipmentId} className={item.monthlyHours > 176 ? "bg-orange-50" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.equipmentName}</p>
                            <p className="text-xs text-gray-500">{item.equipmentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getBuColor(item.bu)}>{item.bu}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{item.jobsite}</p>
                            <p className="text-xs text-gray-500">{item.jobCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className={item.monthlyHours > 176 ? "text-orange-600 font-bold" : ""}>
                            {item.monthlyHours}
                          </span>
                          {item.overageHours > 0 && (
                            <span className="text-xs text-orange-500 block">+{item.overageHours} overage</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={threshold.color}>{threshold.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">${billing.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{item.pcName}</TableCell>
                        <TableCell>
                          {item.billingStatus === "pending" && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                              Pending
                            </Badge>
                          )}
                          {item.billingStatus === "coded" && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              Coded
                            </Badge>
                          )}
                          {item.billingStatus === "billed" && (
                            <Badge className="bg-green-100 text-green-800">Billed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 176hr Threshold Report Tab */}
        <TabsContent value="over176" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Over 176 Hours Report — December 2025</CardTitle>
                  <CardDescription>Equipment exceeding monthly threshold requiring overage billing</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Controller
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Jobsite</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                    <TableHead className="text-right">Overage Hours</TableHead>
                    <TableHead className="text-right">Monthly Rate</TableHead>
                    <TableHead className="text-right">Overage Charge</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {over176Equipment.map((item) => {
                    const rc = rateCards.find((r) => r.equipmentId === item.equipmentId)
                    const monthlyRate = rc?.internalRates.monthly || 10000
                    const hourlyRate = rc?.internalRates.hourly || 80
                    const overageCharge = item.overageHours * hourlyRate
                    return (
                      <TableRow key={item.equipmentId} className="bg-orange-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.equipmentName}</p>
                            <p className="text-xs text-gray-500">{item.equipmentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.jobsite}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{item.monthlyHours} hrs</TableCell>
                        <TableCell className="text-right font-mono text-orange-600">+{item.overageHours} hrs</TableCell>
                        <TableCell className="text-right">${monthlyRate.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-orange-600">+${overageCharge.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          ${(monthlyRate + overageCharge).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="pending">
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="billed">Billed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex justify-between items-center border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Total Overage Billing</p>
                  <p className="text-sm text-green-600">{over176Equipment.length} equipment items over threshold</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    $
                    {over176Equipment
                      .reduce((sum, item) => {
                        const rc = rateCards.find((r) => r.equipmentId === item.equipmentId)
                        const monthlyRate = rc?.internalRates.monthly || 10000
                        const hourlyRate = rc?.internalRates.hourly || 80
                        return sum + monthlyRate + item.overageHours * hourlyRate
                      }, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">Ready for Vista EM Usage Posting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Cards Tab */}
        <TabsContent value="rate-cards" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-800">Internal Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-600">
                  Actual ownership/operating cost • Used for internal cost allocation
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-800">External Rental Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-purple-600">
                  Price charged to outside vendors • Used for third-party billing
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-800">Owner Rate (T&M)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">
                  Client billing rate for T&M projects • Used for customer invoicing
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Equipment Rate Cards</CardTitle>
              <CardDescription>Internal rates shown • Click to view all rate types</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Daily</TableHead>
                    <TableHead className="text-right">Weekly</TableHead>
                    <TableHead className="text-right">Monthly</TableHead>
                    <TableHead className="text-right">Hourly (Overage)</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateCards.map((rc) => (
                    <TableRow key={rc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rc.equipmentName}</p>
                          <p className="text-xs text-gray-500">{rc.equipmentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rc.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">${rc.internalRates.daily}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${rc.internalRates.weekly.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${rc.internalRates.monthly.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">${rc.internalRates.hourly}/hr</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{rc.lastUpdated}</p>
                          <p className="text-xs text-gray-500">{rc.updatedBy}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Queue Tab */}
        <TabsContent value="billing-queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Internal Billing Queue</CardTitle>
                  <CardDescription>Equipment awaiting PC/PM coding for Vista posting</CardDescription>
                </div>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Send Coding Reminders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Jobsite</TableHead>
                    <TableHead>PC/PM</TableHead>
                    <TableHead>Billing Amount</TableHead>
                    <TableHead>Days Waiting</TableHead>
                    <TableHead>Job Code</TableHead>
                    <TableHead>Phase Code</TableHead>
                    <TableHead>Cost Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBilling.map((item) => {
                    const rc = rateCards.find((r) => r.equipmentId === item.equipmentId)
                    const billing = calculateBilling(item.monthlyHours, rc)
                    return (
                      <TableRow key={item.equipmentId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.equipmentName}</p>
                            <p className="text-xs text-gray-500">{item.equipmentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.jobsite}</TableCell>
                        <TableCell>{item.pcName}</TableCell>
                        <TableCell className="font-medium">${billing.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-yellow-600">
                            2 days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input placeholder="Job #" className="w-24 h-8" />
                        </TableCell>
                        <TableCell>
                          <Input placeholder="Phase" className="w-20 h-8" />
                        </TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="labor">Labor</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="material">Material</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Post to Vista</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
