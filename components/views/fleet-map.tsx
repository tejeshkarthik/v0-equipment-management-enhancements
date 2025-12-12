"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Layers, AlertCircle, X } from "lucide-react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })
const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false })

// Fallback SVG map if Leaflet is not available
function SVGMap({ selectedEquipment, onSelectEquipment }: any) {
  return (
    <svg viewBox="0 0 1200 800" className="w-full h-full">
      {/* Background */}
      <rect fill="#E8F4F8" width="1200" height="800" />

      {/* Simplified Louisiana/Texas outline */}
      <path
        d="M 100 200 L 500 150 L 600 250 L 650 350 L 600 450 L 400 500 L 200 450 L 100 350 Z"
        fill="#F0F0F0"
        stroke="#999"
        strokeWidth="2"
      />

      {/* Equipment Clusters */}
      <g onClick={() => onSelectEquipment({ location: "Baton Rouge", count: 12 })}>
        <circle cx="400" cy="300" r="25" fill="#2563EB" className="cursor-pointer hover:r-30" />
        <text x="400" y="310" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
          12
        </text>
        <text x="400" y="340" textAnchor="middle" fontSize="12" fill="#666">
          Baton Rouge
        </text>
      </g>

      <g onClick={() => onSelectEquipment({ location: "Lake Charles", count: 8 })}>
        <circle cx="250" cy="380" r="20" fill="#2563EB" className="cursor-pointer" />
        <text x="250" y="388" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          8
        </text>
        <text x="250" y="415" textAnchor="middle" fontSize="12" fill="#666">
          Lake Charles
        </text>
      </g>

      <g onClick={() => onSelectEquipment({ location: "New Orleans", count: 6 })}>
        <circle cx="550" cy="420" r="18" fill="#2563EB" className="cursor-pointer" />
        <text x="550" y="428" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          6
        </text>
        <text x="550" y="450" textAnchor="middle" fontSize="12" fill="#666">
          New Orleans
        </text>
      </g>

      {/* Geofence circles (dashed) */}
      <circle
        cx="400"
        cy="300"
        r="80"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />
      <circle
        cx="250"
        cy="380"
        r="60"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />
    </svg>
  )
}

const equipmentLocations = [
  {
    id: "EXC-001",
    name: "Excavator CAT 320",
    lat: 30.4523,
    lng: -91.1871,
    status: "active",
    project: "Bunge Project",
    location: "1234 Industrial Rd, Baton Rouge, LA",
    bu: "FVS",
    hours: 6.5,
    operator: "John Smith",
  },
  {
    id: "EXC-002",
    name: "Excavator CAT 320",
    lat: 30.2711,
    lng: -92.4404,
    status: "active",
    project: "Lake Charles Marine",
    location: "Port of Lake Charles",
    bu: "MAR",
    hours: 8.2,
    operator: "Maria Garcia",
  },
  {
    id: "DOZ-002",
    name: "Dozer CAT D6T",
    lat: 29.9511,
    lng: -90.2622,
    status: "maintenance",
    project: "Southern Stone Quarry",
    location: "New Orleans Yard",
    bu: "SSS",
    hours: 0,
    operator: "N/A",
  },
  {
    id: "CR-001",
    name: "Mobile Crane 50T",
    lat: 30.2711,
    lng: -92.4404,
    status: "active",
    project: "Lake Charles Marine",
    location: "Port of Lake Charles",
    bu: "MAR",
    hours: 4.5,
    operator: "Robert Chen",
  },
  {
    id: "DT-001",
    name: "Dump Truck 15T",
    lat: 29.7589,
    lng: -94.7974,
    status: "active",
    project: "Houston Site",
    location: "Houston, TX",
    bu: "FVS",
    hours: 7.8,
    operator: "James Wilson",
  },
]

const geofenceAlerts = [
  { id: 1, equipment: "EXC-003", project: "Bunge Project", time: "11/12/2025 3:20 AM", status: "Authorized" },
  {
    id: 2,
    equipment: "DOZ-125",
    project: "Southern Stone",
    time: "11/11/2025 11:45 PM",
    status: "Under Investigation",
  },
]

const equipmentSummary = {
  active: 187,
  available: 68,
  maintenance: 34,
  outOfService: 23,
}

export default function FleetMap() {
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof equipmentLocations)[0] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [mapType, setMapType] = useState<"map" | "satellite">("map")
  const [showSidebar, setShowSidebar] = useState(true)
  const [filterBu, setFilterBu] = useState("All")
  const [filterType, setFilterType] = useState("All")
  const [filterStatus, setFilterStatus] = useState("Active")
  const [groupBy, setGroupBy] = useState("Project")
  const [useLeaflet, setUseLeaflet] = useState(true)

  const statusColors: Record<string, string> = {
    active: "bg-blue-500",
    available: "bg-green-500",
    maintenance: "bg-yellow-500",
    outOfService: "bg-red-500",
  }

  const statusLabels: Record<string, string> = {
    active: "Active (On Rent)",
    available: "Available",
    maintenance: "In Maintenance",
    outOfService: "Out of Service",
  }

  const getStatusColor = (status: string) => statusColors[status] || "bg-gray-500"
  const getStatusLabel = (status: string) => statusLabels[status] || status

  const filteredEquipment = equipmentLocations.filter((eq) => {
    if (filterBu !== "All" && eq.bu !== filterBu) return false
    if (filterStatus !== "All" && eq.status !== filterStatus.toLowerCase().replace(" ", "")) return false
    return true
  })

  return (
    <div className="flex h-full gap-4 p-6 bg-background">
      {/* Main Map Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top Controls */}
        <div className="flex gap-2 items-center flex-wrap bg-card p-4 rounded-lg border border-border">
          <select
            value={filterBu}
            onChange={(e) => setFilterBu(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background"
          >
            <option>BU: All</option>
            <option value="FVS">FVS - Five-S Group</option>
            <option value="MAR">MAR - Five-S Marine</option>
            <option value="SSS">SSS - Southern Stone</option>
          </select>

          <select className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background">
            <option>Equipment Type: All</option>
            <option>Excavators</option>
            <option>Cranes</option>
            <option>Trucks</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background"
          >
            <option>Status: All</option>
            <option value="Active">Active</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background"
          >
            <option>Group By: Project</option>
            <option value="Business Unit">Business Unit</option>
            <option value="Equipment Type">Equipment Type</option>
          </select>

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant={mapType === "map" ? "default" : "outline"}
              onClick={() => setMapType("map")}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" /> Map
            </Button>
            <Button
              size="sm"
              variant={mapType === "satellite" ? "default" : "outline"}
              onClick={() => setMapType("satellite")}
              className="gap-2 bg-transparent"
            >
              <Layers className="w-4 h-4" /> Satellite
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <Card className="flex-1 relative overflow-hidden bg-muted">
          {useLeaflet ? (
            <div className="w-full h-full">
              <SVGMap selectedEquipment={selectedEquipment} onSelectEquipment={setSelectedLocation} />
            </div>
          ) : (
            <SVGMap selectedEquipment={selectedEquipment} onSelectEquipment={setSelectedLocation} />
          )}
        </Card>

        {/* Equipment List at Bottom */}
        <Card className="p-4 bg-card border border-border max-h-32 overflow-y-auto">
          <h4 className="font-semibold text-foreground mb-2 text-sm">Equipment On Map ({filteredEquipment.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {filteredEquipment.map((eq) => (
              <button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq)}
                className={`p-2 rounded text-xs text-left transition-colors ${
                  selectedEquipment?.id === eq.id
                    ? "bg-accent text-white"
                    : "bg-muted hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="font-medium">{eq.id}</div>
                <div className="text-xs opacity-75">{eq.name}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-80 flex flex-col gap-4 max-h-full overflow-y-auto">
          {/* Equipment Summary */}
          <Card className="p-4 space-y-3 bg-card border border-border">
            <h3 className="font-semibold text-foreground">Fleet Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🔵 Active</span>
                <span className="font-semibold text-blue-600">{equipmentSummary.active}</span>
              </div>
              <div className="ml-4 text-xs text-muted-foreground space-y-1">
                <div>Inside Geofence: {equipmentSummary.active - 7} ✅</div>
                <div>Outside Geofence: 7 ⚠️</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🟢 Available</span>
                <span className="font-semibold text-green-600">{equipmentSummary.available}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🟡 Maintenance</span>
                <span className="font-semibold text-yellow-600">{equipmentSummary.maintenance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🔴 Out of Service</span>
                <span className="font-semibold text-red-600">{equipmentSummary.outOfService}</span>
              </div>
            </div>
          </Card>

          {/* Geofence Alerts */}
          <Card className="p-4 space-y-3 bg-card border border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Geofence Alerts
            </h3>
            <div className="space-y-2">
              {geofenceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="text-xs p-3 bg-orange-50 dark:bg-orange-950 rounded border border-orange-200 dark:border-orange-800"
                >
                  <p className="font-semibold text-orange-900 dark:text-orange-100">⚠️ {alert.equipment}</p>
                  <p className="text-orange-700 dark:text-orange-300">{alert.project}</p>
                  <p className="text-orange-700 dark:text-orange-300">{alert.time}</p>
                  <p className="text-orange-700 dark:text-orange-300">Status: {alert.status}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 space-y-2 bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
            <Button className="w-full justify-start gap-2 bg-accent hover:bg-accent/90 text-sm">
              + Create Geofence
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent text-sm">
              📥 Export Map
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent text-sm">
              📊 Fleet Report
            </Button>
          </Card>

          {/* Selected Equipment Info */}
          {selectedEquipment && (
            <Card className="p-4 space-y-3 border-blue-500 bg-card border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-foreground text-sm">{selectedEquipment.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {selectedEquipment.id}</div>
                </div>
                <button onClick={() => setSelectedEquipment(null)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs space-y-2 text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Status:</span>{" "}
                  {getStatusLabel(selectedEquipment.status)}
                </div>
                <div>
                  <span className="font-medium text-foreground">Project:</span> {selectedEquipment.project}
                </div>
                <div>
                  <span className="font-medium text-foreground">Location:</span> {selectedEquipment.location}
                </div>
                <div>
                  <span className="font-medium text-foreground">BU:</span> {selectedEquipment.bu}
                </div>
                <div>
                  <span className="font-medium text-foreground">Operator:</span> {selectedEquipment.operator}
                </div>
                <div>
                  <span className="font-medium text-foreground">Hours Today:</span> {selectedEquipment.hours} hrs
                </div>
                <div>
                  <span className="font-medium text-foreground">Last Update:</span> 5 min ago
                </div>
              </div>
              <div className="text-xs p-2 bg-green-50 dark:bg-green-950 rounded">✅ Inside geofence boundary</div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                  Show History
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
