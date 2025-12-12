"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Send, DollarSign, Calendar, CheckCircle2 } from "lucide-react"

interface InvoiceItem {
  equipmentId: string
  equipmentName: string
  rateType: string
  quantity: number
  unitRate: number
  totalAmount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  billingPeriod: string
  totalAmount: number
  status: "draft" | "sent" | "paid"
  sentDate: string | null
  paidDate: string | null
  items: InvoiceItem[]
}

const invoiceHistory: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    customer: "Acme Construction",
    billingPeriod: "December 2025",
    totalAmount: 45600,
    status: "paid",
    sentDate: "2025-12-05",
    paidDate: "2025-12-15",
    items: [],
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    customer: "BuildCo LLC",
    billingPeriod: "December 2025",
    totalAmount: 32400,
    status: "sent",
    sentDate: "2025-12-10",
    paidDate: null,
    items: [],
  },
  {
    id: "3",
    invoiceNumber: "DRAFT-003",
    customer: "Mega Projects Inc",
    billingPeriod: "December 2025",
    totalAmount: 18900,
    status: "draft",
    sentDate: null,
    paidDate: null,
    items: [],
  },
]

const getBadgeColor = (bu: string) => {
  if (bu === "FSG") return "bg-blue-100 text-blue-800"
  if (bu === "FSM") return "bg-teal-100 text-teal-800"
  if (bu === "FSE") return "bg-orange-100 text-orange-800"
  return "bg-gray-100 text-gray-800"
}

export default function CustomerBilling() {
  const [billingType, setBillingType] = useState<"internal" | "external">("external")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [billingPeriod, setBillingPeriod] = useState("2025-12")

  const draftCount = invoiceHistory.filter((inv) => inv.status === "draft").length
  const sentCount = invoiceHistory.filter((inv) => inv.status === "sent").length
  const paidCount = invoiceHistory.filter((inv) => inv.status === "paid").length
  const totalRevenue = invoiceHistory
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Billing & Invoicing</h1>
          <p className="text-gray-500">Generate and track equipment rental invoices</p>
        </div>
        <Button size="lg">
          <FileText className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Draft Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{draftCount}</p>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-500" />
              Sent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{sentCount}</p>
            <p className="text-xs text-gray-500">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Paid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Collected this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>Generate monthly equipment billing invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Billing Type Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setBillingType("internal")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                billingType === "internal"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <p className="font-medium">Internal Cross-BU Billing</p>
                <p className="text-xs text-gray-500 mt-1">Between FSG, FSM, FSE business units</p>
              </div>
            </button>
            <button
              onClick={() => setBillingType("external")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                billingType === "external"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <p className="font-medium">External Customer Billing</p>
                <p className="text-xs text-gray-500 mt-1">Third-party clients and contractors</p>
              </div>
            </button>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{billingType === "internal" ? "Business Unit" : "Customer"}</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${billingType === "internal" ? "BU" : "customer"}`} />
                </SelectTrigger>
                <SelectContent>
                  {billingType === "internal" ? (
                    <>
                      <SelectItem value="FSM">FSM - Foundation Specialists Marine</SelectItem>
                      <SelectItem value="FSE">FSE - Foundation Specialists East</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="acme">Acme Construction</SelectItem>
                      <SelectItem value="buildco">BuildCo LLC</SelectItem>
                      <SelectItem value="mega">Mega Projects Inc</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Period</Label>
              <Input type="month" value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Input type="date" defaultValue="2025-12-31" />
            </div>
          </div>

          {/* Equipment Selection */}
          {selectedCustomer && (
            <div>
              <h4 className="font-medium mb-3">Equipment List for Billing</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead className="text-right">Quantity/Hours</TableHead>
                    <TableHead className="text-right">Unit Rate</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Checkbox defaultChecked />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">CAT 336 Excavator</p>
                        <p className="text-xs text-gray-500">EX-1045</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Monthly + 24hr Overage</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">200 hrs</TableCell>
                    <TableCell className="text-right font-mono">$12,000 + $80/hr</TableCell>
                    <TableCell className="text-right font-bold text-green-600">$13,920</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox defaultChecked />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">CAT D8T Bulldozer</p>
                        <p className="text-xs text-gray-500">BD-2013</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Monthly Rate</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">168 hrs</TableCell>
                    <TableCell className="text-right font-mono">$15,000</TableCell>
                    <TableCell className="text-right font-bold text-green-600">$15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Kenworth T800 Dump Truck</p>
                        <p className="text-xs text-gray-500">TK-5102</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Weekly Rate</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">88 hrs</TableCell>
                    <TableCell className="text-right font-mono">$1,800/wk</TableCell>
                    <TableCell className="text-right font-bold text-green-600">$7,200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">Invoice Total</p>
                  <p className="text-sm text-green-600">3 equipment items • December 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">$36,120</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      Save as Draft
                    </Button>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Generate & Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Past and current invoices</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Billing Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {invoice.billingPeriod}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.sentDate || "—"}</TableCell>
                  <TableCell>{invoice.paidDate || "—"}</TableCell>
                  <TableCell>
                    {invoice.status === "draft" && (
                      <Badge variant="outline" className="text-gray-600">
                        Draft
                      </Badge>
                    )}
                    {invoice.status === "sent" && <Badge className="bg-blue-100 text-blue-800">Sent</Badge>}
                    {invoice.status === "paid" && <Badge className="bg-green-100 text-green-800">Paid</Badge>}
                  </TableCell>
                  <TableCell>
                    {invoice.status === "draft" && (
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    )}
                    {invoice.status === "sent" && (
                      <Button size="sm" variant="outline">
                        Resend
                      </Button>
                    )}
                    {invoice.status === "paid" && (
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
