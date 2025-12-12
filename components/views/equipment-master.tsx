"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, Grid3x3, List, MoreHorizontal } from "lucide-react"
import EquipmentDetailModal from "@/components/equipment-detail-modal"
import AddEquipmentModal from "@/components/add-equipment-modal"

const equipmentData = [
  {
    id: "EXC-001",
    name: "CAT 320 Excavator",
    type: "Excavator",
    category: "Heavy Equipment",
    status: "Available",
    location: "Yard A",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$125/hr",
    value: 285000,
  },
  {
    id: "EXC-002",
    name: "CAT 325 Excavator",
    type: "Excavator",
    category: "Heavy Equipment",
    status: "On Rent",
    location: "Metro Site",
    assignment: "Metro Construction",
    assignmentType: "Internal Assigned",
    rate: "$125/hr",
    value: 295000,
  },
  {
    id: "DOZ-001",
    name: "CAT D6T Dozer",
    type: "Dozer",
    category: "Heavy Equipment",
    status: "In Maintenance",
    location: "Service Bay 1",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$150/hr",
    value: 320000,
  },
  {
    id: "DOZ-002",
    name: "CAT D8R Dozer",
    type: "Dozer",
    category: "Heavy Equipment",
    status: "Available",
    location: "Yard B",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$150/hr",
    value: 350000,
  },
  {
    id: "DT-001",
    name: "Dump Truck 10T",
    type: "Dump Truck",
    category: "Vehicles",
    status: "On Rent",
    location: "Highway 101",
    assignment: "Bridge Project",
    assignmentType: "Cross-BU Assigned",
    rate: "$85/hr",
    value: 85000,
  },
  {
    id: "DT-002",
    name: "Dump Truck 15T",
    type: "Dump Truck",
    category: "Vehicles",
    status: "Available",
    location: "Yard C",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$95/hr",
    value: 105000,
  },
  {
    id: "GEN-001",
    name: "Generator 50kW",
    type: "Generator",
    category: "Light Equipment",
    status: "Available",
    location: "Equipment Store",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$45/hr",
    value: 8500,
  },
  {
    id: "GEN-002",
    name: "Generator 75kW",
    type: "Generator",
    category: "Light Equipment",
    status: "Out of Service",
    location: "Service Bay 2",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$65/hr",
    value: 12500,
  },
  {
    id: "CR-001",
    name: "Mobile Crane 50T",
    type: "Crane",
    category: "Heavy Equipment",
    status: "On Rent",
    location: "Downtown Site",
    assignment: "Skyscraper Dev",
    assignmentType: "On Rent",
    rate: "$350/hr",
    value: 450000,
  },
  {
    id: "CR-002",
    name: "Tower Crane 80T",
    type: "Crane",
    category: "Heavy Equipment",
    status: "In Maintenance",
    location: "Service Facility",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$450/hr",
    value: 550000,
  },
  {
    id: "EXC-003",
    name: "Komatsu PC200 Excavator",
    type: "Excavator",
    category: "Heavy Equipment",
    status: "Available",
    location: "Yard A",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$120/hr",
    value: 275000,
  },
  {
    id: "DT-003",
    name: "Dump Truck 20T",
    type: "Dump Truck",
    category: "Vehicles",
    status: "Available",
    location: "Yard D",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$105/hr",
    value: 125000,
  },
  {
    id: "GEN-003",
    name: "Generator 100kW",
    type: "Generator",
    category: "Light Equipment",
    status: "On Rent",
    location: "Event Site",
    assignment: "Music Festival",
    assignmentType: "On Rent",
    rate: "$75/hr",
    value: 18500,
  },
  {
    id: "CR-003",
    name: "Boom Lift 60ft",
    type: "Lift",
    category: "Light Equipment",
    status: "Available",
    location: "Yard E",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$85/hr",
    value: 42000,
  },
  {
    id: "DOZ-003",
    name: "CAT D7R Dozer",
    type: "Dozer",
    category: "Heavy Equipment",
    status: "Available",
    location: "Yard F",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$145/hr",
    value: 340000,
  },
  {
    id: "HAND-001",
    name: "Hydraulic Breaker Kit",
    type: "Attachment",
    category: "Small Tools & Accessories",
    status: "Available",
    location: "Equipment Store",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$12/hr",
    value: 2500,
  },
  {
    id: "HAND-002",
    name: "Safety Equipment Bundle",
    type: "Safety Equipment",
    category: "Small Tools & Accessories",
    status: "Available",
    location: "Equipment Store",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$5/hr",
    value: 1500,
  },
  {
    id: "HAND-003",
    name: "Bucket Teeth Set",
    type: "Attachment",
    category: "Small Tools & Accessories",
    status: "Available",
    location: "Equipment Store",
    assignment: "—",
    assignmentType: "Unassigned",
    rate: "$3/hr",
    value: 800,
  },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-800",
    "On Rent": "bg-blue-100 text-blue-800",
    "In Maintenance": "bg-yellow-100 text-yellow-800",
    "Out of Service": "bg-red-100 text-red-800",
  }
  return <span className={`text-xs font-semibold px-2 py-1 rounded ${colors[status]}`}>{status}</span>
}

export default function EquipmentMaster() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof equipmentData)[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddEquipment, setShowAddEquipment] = useState(false)
  const [equipmentList, setEquipmentList] = useState(equipmentData)
  const [filters, setFilters] = useState({
    category: "All Equipment",
    status: [] as string[],
    type: [] as string[],
    assignment: "All Equipment",
    location: [] as string[],
  })

  const filtered = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.id.toLowerCase().includes(searchTerm.toLowerCase()) || eq.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filters.category === "All Equipment" || eq.category === filters.category
    const matchesStatus = filters.status.length === 0 || filters.status.includes(eq.status)
    const matchesType = filters.type.length === 0 || filters.type.includes(eq.type)
    const matchesAssignment = filters.assignment === "All Equipment" || eq.assignmentType === filters.assignment
    const matchesLocation = filters.location.length === 0 || filters.location.includes(eq.location)

    return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesAssignment && matchesLocation
  })

  const toggleFilter = (category: "status" | "type" | "location", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  const handleEquipmentAdded = (newEquipment: any) => {
    setEquipmentList((prev) => [
      ...prev,
      {
        id: newEquipment.id,
        name: newEquipment.name,
        type: newEquipment.type,
        category: "Heavy Equipment",
        status: newEquipment.status,
        location: newEquipment.location,
        assignment: "—",
        assignmentType: "Unassigned",
        rate: "$125/hr",
        value: 285000,
      },
    ])
  }

  const isShowingSmallTools = filters.category === "Small Tools & Accessories"

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
            {filters.status.length + filters.type.length + filters.location.length > 0 && (
              <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs">
                {filters.status.length + filters.type.length + filters.location.length}
              </span>
            )}
          </Button>
          <div className="border border-border rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${viewMode === "table" ? "bg-accent text-white" : "hover:bg-muted"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-accent text-white" : "hover:bg-muted"}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90" onClick={() => setShowAddEquipment(true)}>
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Category</h4>
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full border border-border rounded px-3 py-2 text-sm text-foreground"
              >
                <option value="All Equipment">All Equipment</option>
                <option value="Heavy Equipment">Heavy Equipment (Excavators, Dozers, Cranes)</option>
                <option value="Light Equipment">Light Equipment (Generators, Compressors)</option>
                <option value="Vehicles">Vehicles (Dump Trucks, Pickups, Trailers)</option>
                <option value="Small Tools & Accessories">
                  Small Tools & Accessories (Hand tools, Safety, Attachments)
                </option>
              </select>
            </div>

            {/* Equipment Type Filter */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Equipment Type</h4>
              <div className="space-y-2">
                {[
                  "Excavator",
                  "Dozer",
                  "Dump Truck",
                  "Generator",
                  "Crane",
                  "Lift",
                  "Attachment",
                  "Safety Equipment",
                ].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => toggleFilter("type", type)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assignment Filter */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Assignment Status</h4>
              <select
                value={filters.assignment}
                onChange={(e) => setFilters((prev) => ({ ...prev, assignment: e.target.value }))}
                className="w-full border border-border rounded px-3 py-2 text-sm text-foreground mb-3"
              >
                <option value="All Equipment">All Equipment</option>
                <option value="Internal Assigned">Internal Assigned (on company projects)</option>
                <option value="On Rent">On Rent (external customers)</option>
                <option value="Unassigned">Unassigned (available)</option>
                <option value="Cross-BU Assigned">Cross-BU Assigned (used by different BU)</option>
              </select>

              <h4 className="font-semibold text-foreground mb-3 mt-4">Status</h4>
              <div className="space-y-2">
                {["Available", "On Rent", "In Maintenance", "Out of Service"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter("status", status)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() =>
                setFilters({
                  category: "All Equipment",
                  status: [],
                  type: [],
                  assignment: "All Equipment",
                  location: [],
                })
              }
            >
              Clear All
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90">
              Apply Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Equipment ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                  {isShowingSmallTools && (
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Category</th>
                  )}
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Assignment</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rate</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((equipment) => (
                  <tr
                    key={equipment.id}
                    onClick={() => setSelectedEquipment(equipment)}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{equipment.id}</td>
                    <td className="py-3 px-4 text-foreground">{equipment.name}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{equipment.type}</td>
                    {isShowingSmallTools && (
                      <td className="py-3 px-4 text-muted-foreground text-xs">{equipment.type}</td>
                    )}
                    <td className="py-3 px-4">
                      <StatusBadge status={equipment.status} />
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{equipment.location}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{equipment.assignment}</td>
                    <td className="py-3 px-4 font-medium text-accent text-xs">{equipment.rate}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((equipment) => (
            <Card
              key={equipment.id}
              onClick={() => setSelectedEquipment(equipment)}
              className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                isShowingSmallTools ? "md:grid-cols-2 lg:grid-cols-4" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{equipment.id}</h4>
                  <p className="text-xs text-muted-foreground">{equipment.name}</p>
                </div>
                <StatusBadge status={equipment.status} />
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  Type: <span className="text-foreground">{equipment.type}</span>
                </p>
                <p className="text-muted-foreground">
                  Location: <span className="text-foreground">{equipment.location}</span>
                </p>
                <p className="text-muted-foreground">
                  Rate: <span className="font-medium text-accent">{equipment.rate}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedEquipment && (
        <EquipmentDetailModal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}

      {showAddEquipment && (
        <AddEquipmentModal onClose={() => setShowAddEquipment(false)} onEquipmentAdded={handleEquipmentAdded} />
      )}
    </div>
  )
}
