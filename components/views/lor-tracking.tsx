"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useState } from "react"
import LORDetailModal from "@/components/lor-detail-modal"
import RequestForm from "@/components/request-form"
import AvailabilityModal from "@/components/availability-modal"

const kanbanColumns = [
  {
    id: "submitted",
    title: "Submitted",
    color: "border-blue-300",
    bgColor: "bg-blue-50",
    cards: [
      {
        id: "REQ-004",
        equipment: "Mobile Crane 50T",
        quantity: 1,
        project: "Skyscraper Development",
        dateRange: "Nov 22 - Dec 5",
        requestedBy: "Lisa Wang",
        urgency: "Routine",
        status: "Submitted",
        businessUnit: "FVS",
        location: "Downtown Baton Rouge",
        jobsite: "100 Main St, BR, LA",
        days: 13,
      },
      {
        id: "REQ-007",
        equipment: "Excavator 20T",
        quantity: 1,
        project: "Bridge Project",
        dateRange: "Nov 15 - Nov 30",
        requestedBy: "Tom Martinez",
        urgency: "Urgent",
        status: "Submitted",
        businessUnit: "MAR",
        location: "Lake Charles",
        jobsite: "Bridge Site Access Rd, LC, LA",
        days: 15,
      },
      {
        id: "REQ-009",
        equipment: "Dump Truck 15T",
        quantity: 2,
        project: "Road Construction",
        dateRange: "Nov 12 - Nov 20",
        requestedBy: "Alex Rodriguez",
        urgency: "Critical",
        status: "Submitted",
        businessUnit: "SSS",
        location: "Highway 61",
        jobsite: "Hwy 61 Mile Marker 42, BR, LA",
        days: 8,
      },
    ],
  },
  {
    id: "approved",
    title: "Approved",
    color: "border-green-300",
    bgColor: "bg-green-50",
    cards: [
      {
        id: "REQ-001",
        equipment: "Excavator CAT 320",
        quantity: 1,
        project: "Metro Transit Project",
        dateRange: "Nov 15 - Nov 30",
        requestedBy: "John Smith",
        urgency: "Routine",
        status: "Approved",
        businessUnit: "FVS",
        location: "Downtown Baton Rouge",
        jobsite: "Transit Hub, BR, LA",
        days: 15,
      },
    ],
  },
  {
    id: "pending-inspection",
    title: "Pending Inspection",
    color: "border-yellow-300",
    bgColor: "bg-yellow-50",
    cards: [
      {
        id: "REQ-002",
        equipment: "Mobile Crane 50T",
        quantity: 1,
        project: "Factory Expansion",
        dateRange: "Nov 18 - Nov 28",
        requestedBy: "Sarah Chen",
        urgency: "Routine",
        status: "Pending Inspection",
        businessUnit: "FVS",
        location: "Industrial District",
        jobsite: "Factory Blvd, BR, LA",
        days: 10,
      },
    ],
  },
  {
    id: "ready",
    title: "Ready for Dispatch",
    color: "border-green-300",
    bgColor: "bg-green-100",
    cards: [
      {
        id: "REQ-006",
        equipment: "Excavator Komatsu PC200",
        quantity: 1,
        project: "Foundation Digging",
        dateRange: "Nov 11 - Nov 20",
        requestedBy: "Alex Rodriguez",
        urgency: "Routine",
        status: "Ready for Dispatch",
        businessUnit: "SSS",
        location: "Job Site A",
        jobsite: "Foundation Lot, Construction Ave, BR, LA",
        days: 9,
      },
    ],
  },
  {
    id: "transit",
    title: "In Transit",
    color: "border-purple-300",
    bgColor: "bg-purple-50",
    cards: [
      {
        id: "REQ-003",
        equipment: "Dump Truck 20T",
        quantity: 1,
        project: "Construction Site A",
        dateRange: "Nov 10 - Nov 18",
        requestedBy: "Emma Davis",
        urgency: "Routine",
        status: "In Transit",
        businessUnit: "MAR",
        location: "Site A",
        jobsite: "Construction Way, BR, LA",
        days: 8,
      },
    ],
  },
]

function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = {
    Routine: "bg-gray-100 text-gray-800",
    Urgent: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800 animate-pulse",
  }
  return <Badge className={colors[urgency] || "bg-gray-100"}>{urgency}</Badge>
}

function BUBadge({ bu }: { bu: string }) {
  const colors: Record<string, string> = {
    FVS: "bg-blue-100 text-blue-800",
    MAR: "bg-teal-100 text-teal-800",
    SSS: "bg-orange-100 text-orange-800",
  }
  return <Badge className={colors[bu] || "bg-gray-100"}>{bu}</Badge>
}

export default function LorTracking() {
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [columns, setColumns] = useState(kanbanColumns)
  const [filterBu, setFilterBu] = useState<string>("")
  const [filterUrgency, setFilterUrgency] = useState<string>("")
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [selectedCardForAvailability, setSelectedCardForAvailability] = useState<any>(null)

  const handleNewRequest = (newRequest: any) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === "submitted") {
        return {
          ...col,
          cards: [
            ...col.cards,
            {
              ...newRequest,
              businessUnit: "FVS",
            },
          ],
        }
      }
      return col
    })
    setColumns(updatedColumns)
  }

  const handleCheckAvailability = (card: any) => {
    setSelectedCardForAvailability(card)
    setShowAvailabilityModal(true)
  }

  const filteredColumns = columns.map((col) => ({
    ...col,
    cards: col.cards.filter((card) => {
      if (filterBu && card.businessUnit !== filterBu) return false
      if (filterUrgency && card.urgency !== filterUrgency) return false
      return true
    }),
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Equipment Requests</h2>
          <p className="text-sm text-muted-foreground">Track equipment requests through approval workflow</p>
        </div>
        <Button onClick={() => setShowRequestForm(true)} className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border">
        <select
          value={filterBu}
          onChange={(e) => setFilterBu(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded text-sm"
        >
          <option value="">All Requests</option>
          <option value="FVS">Five-S Group (FVS)</option>
          <option value="MAR">Five-S Marine (MAR)</option>
          <option value="SSS">Southern Stone (SSS)</option>
        </select>

        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded text-sm"
        >
          <option value="">Filter by Urgency</option>
          <option value="Routine">Routine</option>
          <option value="Urgent">Urgent</option>
          <option value="Critical">Critical</option>
        </select>

        {(filterBu || filterUrgency) && (
          <Button
            onClick={() => {
              setFilterBu("")
              setFilterUrgency("")
            }}
            variant="outline"
            size="sm"
            className="bg-transparent"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 auto-cols-max overflow-x-auto pb-4">
        {filteredColumns.map((column) => (
          <div key={column.id} className="min-w-80 flex flex-col">
            {/* Column Header */}
            <div className={`border-l-4 p-4 ${column.color} ${column.bgColor} rounded-t-lg`}>
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <p className="text-sm text-muted-foreground">{column.cards.length} requests</p>
            </div>

            {/* Cards */}
            <div className={`flex-1 p-3 space-y-3 bg-muted/30 rounded-b-lg min-h-96`}>
              {column.cards.map((card: any) => (
                <Card
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-card hover:bg-card/80"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-foreground text-sm">{card.id}</h4>
                    <UrgencyBadge urgency={card.urgency} />
                  </div>

                  <p className="text-sm font-medium text-foreground mb-1">{card.equipment}</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {card.quantity > 1 ? `Qty: ${card.quantity}` : ""}
                  </p>

                  <div className="border-t border-border my-2 pt-2">
                    <p className="text-xs text-foreground font-medium mb-1">{card.project}</p>
                    <p className="text-xs text-muted-foreground mb-1">
                      BU: <BUBadge bu={card.businessUnit} />
                    </p>
                    <p className="text-xs text-muted-foreground">📍 {card.location}</p>
                    <p className="text-xs text-muted-foreground">📅 {card.days} days</p>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">Requested by: {card.requestedBy}</div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCheckAvailability(card)
                      }}
                    >
                      Check Availability
                    </Button>
                  </div>
                </Card>
              ))}
              {column.cards.length === 0 && column.id !== "completed" && (
                <div className="text-center py-8 text-muted-foreground text-sm">No requests</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCard && <LORDetailModal request={selectedCard} onClose={() => setSelectedCard(null)} />}

      {showRequestForm && <RequestForm onClose={() => setShowRequestForm(false)} onSubmit={handleNewRequest} />}

      {showAvailabilityModal && selectedCardForAvailability && (
        <AvailabilityModal
          request={selectedCardForAvailability}
          onClose={() => setShowAvailabilityModal(false)}
          onAssign={() => {
            setShowAvailabilityModal(false)
            // Simulate moving to pending inspection
            const updatedColumns = columns.map((col) => {
              if (col.id === "submitted") {
                return {
                  ...col,
                  cards: col.cards.filter((c) => c.id !== selectedCardForAvailability.id),
                }
              }
              if (col.id === "pending-inspection") {
                return {
                  ...col,
                  cards: [...col.cards, { ...selectedCardForAvailability, status: "Pending Inspection" }],
                }
              }
              return col
            })
            setColumns(updatedColumns)
          }}
        />
      )}
    </div>
  )
}
