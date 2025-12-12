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
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  MapPin,
  Plus,
  Radio,
  RefreshCw,
  Satellite,
  Settings,
  Signal,
  SignalZero,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Five-S Telematics Providers (from October discovery):
// Bell Fleetmatic, CAT VisionLink, John Deere JD Link, Komatsu Komtrax,
// Volvo, Liebherr, New Holland, Hyundai
// Third-party: TrackUnit, Teletrac Navman

interface TelematicsDevice {
  id: string
  deviceId: string
  provider: string
  assetId: string
  assetName: string
  status: "reporting" | "delayed" | "offline"
  lastReported: string
  hoursOffline: number
  signalStrength: number
  batteryLevel: number | null
  location: string
  isPrimary: boolean
}

interface Geofence {
  id: string
  name: string
  jobCode: string
  workType: "Heavy Civil" | "Material Supply" | "Marine"
  address: string
  status: "active" | "archived"
  assetsInside: number
  createdDate: string
  startDate: string
  endDate: string | null
  siteContact: string
  color: string
}

interface AssetNotReporting {
  assetId: string
  assetName: string
  lastReported: string
  hoursDown: number
  provider: string
  deviceId: string
  lastLocation: string
  issue: string
  assignedTo: string | null
}

const telematicsDevices: TelematicsDevice[] = [
  {
    id: "TD001",
    deviceId: "TU-847291",
    provider: "TrackUnit",
    assetId: "EQ-2847",
    assetName: "CAT 336 Excavator",
    status: "reporting",
    lastReported: "2 min ago",
    hoursOffline: 0,
    signalStrength: 95,
    batteryLevel: null,
    location: "LA-2847 Highway",
    isPrimary: true,
  },
  {
    id: "TD002",
    deviceId: "VL-293847",
    provider: "CAT VisionLink",
    assetId: "EQ-2847",
    assetName: "CAT 336 Excavator",
    status: "reporting",
    lastReported: "5 min ago",
    hoursOffline: 0,
    signalStrength: 88,
    batteryLevel: null,
    location: "LA-2847 Highway",
    isPrimary: false,
  },
  {
    id: "TD003",
    deviceId: "KX-192837",
    provider: "Komatsu Komtrax",
    assetId: "EQ-1923",
    assetName: "Komatsu D65 Dozer",
    status: "reporting",
    lastReported: "8 min ago",
    hoursOffline: 0,
    signalStrength: 92,
    batteryLevel: null,
    location: "TX-1156 Port",
    isPrimary: true,
  },
  {
    id: "TD004",
    deviceId: "TN-384756",
    provider: "Teletrac Navman",
    assetId: "EQ-3156",
    assetName: "Volvo A40G Truck",
    status: "delayed",
    lastReported: "4 hrs ago",
    hoursOffline: 4,
    signalStrength: 45,
    batteryLevel: 67,
    location: "LA-3321 Levee",
    isPrimary: true,
  },
  {
    id: "TD005",
    deviceId: "JD-847562",
    provider: "John Deere JD Link",
    assetId: "EQ-4521",
    assetName: "JD 850K Dozer",
    status: "offline",
    lastReported: "52 hrs ago",
    hoursOffline: 52,
    signalStrength: 0,
    batteryLevel: 12,
    location: "Unknown",
    isPrimary: true,
  },
  {
    id: "TD006",
    deviceId: "TU-192746",
    provider: "TrackUnit",
    assetId: "EQ-5678",
    assetName: "Grove RT880E Crane",
    status: "reporting",
    lastReported: "1 min ago",
    hoursOffline: 0,
    signalStrength: 98,
    batteryLevel: null,
    location: "LA-3321 Levee",
    isPrimary: true,
  },
]

const geofences: Geofence[] = [
  {
    id: "GF001",
    name: "LA-2847 Highway Expansion",
    jobCode: "2847-001",
    workType: "Heavy Civil",
    address: "I-10 Mile Marker 42-48, Baton Rouge, LA",
    status: "active",
    assetsInside: 8,
    createdDate: "2025-09-15",
    startDate: "2025-10-01",
    endDate: null,
    siteContact: "Mike Johnson (225) 555-0142",
    color: "blue",
  },
  {
    id: "GF002",
    name: "TX-1156 Port Dredging",
    jobCode: "1156-003",
    workType: "Marine",
    address: "Port of Houston, TX",
    status: "active",
    assetsInside: 5,
    createdDate: "2025-08-20",
    startDate: "2025-09-01",
    endDate: null,
    siteContact: "Sarah Mitchell (713) 555-0198",
    color: "teal",
  },
  {
    id: "GF003",
    name: "LA-3321 Levee Repair",
    jobCode: "3321-002",
    workType: "Heavy Civil",
    address: "Mississippi River Levee, New Orleans, LA",
    status: "active",
    assetsInside: 4,
    createdDate: "2025-10-10",
    startDate: "2025-10-15",
    endDate: "2025-12-31",
    siteContact: "Tom Anderson (504) 555-0167",
    color: "blue",
  },
  {
    id: "GF004",
    name: "Five-S Yard - Baton Rouge",
    jobCode: "YARD-001",
    workType: "Material Supply",
    address: "8847 Industrial Blvd, Baton Rouge, LA",
    status: "active",
    assetsInside: 12,
    createdDate: "2024-01-01",
    startDate: "2024-01-01",
    endDate: null,
    siteContact: "Lindsey Thurmon (225) 555-0111",
    color: "orange",
  },
  {
    id: "GF005",
    name: "LA-2200 Bridge Demo (Completed)",
    jobCode: "2200-001",
    workType: "Heavy Civil",
    address: "Old River Bridge, LA",
    status: "archived",
    assetsInside: 0,
    createdDate: "2025-03-01",
    startDate: "2025-03-15",
    endDate: "2025-08-30",
    siteContact: "Archived",
    color: "gray",
  },
]

const assetsNotReporting: AssetNotReporting[] = [
  {
    assetId: "EQ-4521",
    assetName: "JD 850K Dozer",
    lastReported: "52 hrs ago",
    hoursDown: 52,
    provider: "John Deere JD Link",
    deviceId: "JD-847562",
    lastLocation: "LA-2847 Highway",
    issue: "Low battery / possible cellular outage",
    assignedTo: "Silas Dupuy",
  },
  {
    assetId: "EQ-7892",
    assetName: "Liebherr LTM 1100",
    lastReported: "96 hrs ago",
    hoursDown: 96,
    provider: "Liebherr",
    deviceId: "LB-293847",
    lastLocation: "TX-1156 Port",
    issue: "Device malfunction - service scheduled",
    assignedTo: "Mac Lindsey",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "reporting":
      return <Signal className="w-4 h-4 text-green-500" />
    case "delayed":
      return <Clock className="w-4 h-4 text-yellow-500" />
    case "offline":
      return <SignalZero className="w-4 h-4 text-red-500" />
    default:
      return <Radio className="w-4 h-4 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "reporting":
      return <Badge className="bg-green-100 text-green-800">Reporting</Badge>
    case "delayed":
      return <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
    case "offline":
      return <Badge className="bg-red-100 text-red-800">Offline</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getWorkTypeColor = (type: string) => {
  switch (type) {
    case "Heavy Civil":
      return "bg-blue-100 text-blue-800"
    case "Marine":
      return "bg-teal-100 text-teal-800"
    case "Material Supply":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const providerLogos: Record<string, string> = {
  TrackUnit: "🔵",
  "CAT VisionLink": "🟡",
  "Komatsu Komtrax": "🔴",
  "Teletrac Navman": "🟢",
  "John Deere JD Link": "🟢",
  Volvo: "🔵",
  Liebherr: "🟡",
}

export default function TelematicsGeofencing() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mapDeviceOpen, setMapDeviceOpen] = useState(false)
  const [newGeofenceOpen, setNewGeofenceOpen] = useState(false)

  const reportingCount = telematicsDevices.filter((d) => d.status === "reporting").length
  const delayedCount = telematicsDevices.filter((d) => d.status === "delayed").length
  const offlineCount = telematicsDevices.filter((d) => d.status === "offline").length
  const activeGeofences = geofences.filter((g) => g.status === "active").length

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telematics & Geofencing</h1>
          <p className="text-gray-500">Monitor device health, API feeds, and job site boundaries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All APIs
          </Button>
          <Dialog open={newGeofenceOpen} onOpenChange={setNewGeofenceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Geofence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Geofence</DialogTitle>
                <DialogDescription>Define job site boundary for asset tracking</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input placeholder="e.g., LA-4455 Bridge Construction" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job/Phase Code</Label>
                    <Input placeholder="e.g., 4455-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heavy-civil">Heavy Civil (Blue)</SelectItem>
                        <SelectItem value="marine">Marine (Teal)</SelectItem>
                        <SelectItem value="material-supply">Material Supply (Orange)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Site address or coordinates" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Site Contact</Label>
                  <Input placeholder="Name and phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Boundary</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
                    <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload KML file or draw boundary on map</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Upload KML
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewGeofenceOpen(false)}>
                  Cancel
                </Button>
                <Button>Create Geofence</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alert for offline devices */}
      {offlineCount > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Assets Not Reporting</AlertTitle>
          <AlertDescription className="text-red-700">
            {offlineCount} device(s) have not reported in over 48 hours and require attention
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-500" />
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{telematicsDevices.length}</p>
            <p className="text-xs text-gray-500">Mapped trackers</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Signal className="w-4 h-4 text-green-500" />
              Reporting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{reportingCount}</p>
            <p className="text-xs text-gray-500">Active & healthy</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{delayedCount}</p>
            <p className="text-xs text-gray-500">1-48 hrs gap</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <SignalZero className="w-4 h-4 text-red-500" />
              Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            <p className="text-xs text-gray-500">&gt;48 hrs down</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Active Geofences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeGeofences}</p>
            <p className="text-xs text-gray-500">Job site boundaries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Satellite className="w-4 h-4 text-purple-500" />
              API Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-gray-500">Connected feeds</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Device Modal */}
      <Dialog open={mapDeviceOpen} onOpenChange={setMapDeviceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Map Telematics Device to Asset</DialogTitle>
            <DialogDescription>Connect a tracking device to equipment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Search by asset number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq-2847">EQ-2847 - CAT 336 Excavator</SelectItem>
                  <SelectItem value="eq-1923">EQ-1923 - Komatsu D65 Dozer</SelectItem>
                  <SelectItem value="eq-3156">EQ-3156 - Volvo A40G Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Telematics Provider</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trackunit">TrackUnit</SelectItem>
                  <SelectItem value="teletrac">Teletrac Navman</SelectItem>
                  <SelectItem value="cat">CAT VisionLink</SelectItem>
                  <SelectItem value="komatsu">Komatsu Komtrax</SelectItem>
                  <SelectItem value="deere">John Deere JD Link</SelectItem>
                  <SelectItem value="volvo">Volvo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Device ID / Serial Number</Label>
              <Input placeholder="Enter device ID from provider portal" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="primary" className="rounded" />
              <Label htmlFor="primary" className="text-sm font-normal">
                Set as primary device for this asset
              </Label>
            </div>
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Multiple devices can be mapped to one asset. The primary device is used for official hours and location
                reporting.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMapDeviceOpen(false)}>
              Cancel
            </Button>
            <Button>Map Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Device Overview</TabsTrigger>
          <TabsTrigger value="not-reporting">Assets Not Reporting</TabsTrigger>
          <TabsTrigger value="geofences">Geofences</TabsTrigger>
          <TabsTrigger value="providers">API Providers</TabsTrigger>
        </TabsList>

        {/* Device Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Telematics Devices</CardTitle>
                  <CardDescription>All mapped tracking devices by asset</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setMapDeviceOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Map New Device
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reported</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {telematicsDevices.map((device) => (
                    <TableRow
                      key={device.id}
                      className={
                        device.status === "offline" ? "bg-red-50" : device.status === "delayed" ? "bg-yellow-50" : ""
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{device.assetName}</p>
                          <p className="text-xs text-gray-500">{device.assetId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{device.deviceId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{providerLogos[device.provider]}</span>
                          <span className="text-sm">{device.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(device.status)}
                          {getStatusBadge(device.status)}
                        </div>
                      </TableCell>
                      <TableCell className={device.hoursOffline > 48 ? "text-red-600 font-medium" : ""}>
                        {device.lastReported}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {device.signalStrength > 70 ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : device.signalStrength > 30 ? (
                            <Wifi className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">{device.signalStrength}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{device.location}</TableCell>
                      <TableCell>
                        {device.isPrimary ? (
                          <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                        ) : (
                          <Badge variant="outline">Secondary</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Not Reporting Tab */}
        <TabsContent value="not-reporting" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-red-800">Assets Not Reporting (&gt;48 Hours)</CardTitle>
                  <CardDescription>Devices requiring immediate attention</CardDescription>
                </div>
                <Badge variant="destructive">{assetsNotReporting.length} Down</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Hours Down</TableHead>
                    <TableHead>Last Location</TableHead>
                    <TableHead>Suspected Issue</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsNotReporting.map((asset) => (
                    <TableRow key={asset.assetId} className="bg-red-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{asset.assetName}</p>
                          <p className="text-xs text-gray-500">{asset.assetId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{asset.deviceId}</TableCell>
                      <TableCell>{asset.provider}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{asset.hoursDown} hrs</Badge>
                      </TableCell>
                      <TableCell>{asset.lastLocation}</TableCell>
                      <TableCell className="text-sm">{asset.issue}</TableCell>
                      <TableCell>{asset.assignedTo || "-"}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Schedule Service
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geofences Tab */}
        <TabsContent value="geofences" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Job Site Geofences</CardTitle>
                  <CardDescription>Boundaries for asset location tracking</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="active">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Job Code</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Assets Inside</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geofences.map((gf) => (
                    <TableRow key={gf.id} className={gf.status === "archived" ? "opacity-50" : ""}>
                      <TableCell className="font-medium">{gf.name}</TableCell>
                      <TableCell className="font-mono text-sm">{gf.jobCode}</TableCell>
                      <TableCell>
                        <Badge className={getWorkTypeColor(gf.workType)}>{gf.workType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-48 truncate">{gf.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{gf.assetsInside} assets</Badge>
                      </TableCell>
                      <TableCell>{gf.startDate}</TableCell>
                      <TableCell>{gf.endDate || "-"}</TableCell>
                      <TableCell>
                        {gf.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="outline">Archived</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          {gf.status === "active" && (
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              Archive
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Providers Tab */}
        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "TrackUnit", devices: 2, status: "connected", lastSync: "2 min ago" },
              { name: "Teletrac Navman", devices: 1, status: "connected", lastSync: "5 min ago" },
              { name: "CAT VisionLink", devices: 1, status: "connected", lastSync: "8 min ago" },
              { name: "Komatsu Komtrax", devices: 1, status: "connected", lastSync: "10 min ago" },
              { name: "John Deere JD Link", devices: 1, status: "warning", lastSync: "4 hrs ago" },
              { name: "Volvo", devices: 0, status: "connected", lastSync: "15 min ago" },
              { name: "Liebherr", devices: 1, status: "error", lastSync: "96 hrs ago" },
              { name: "Bell Fleetmatic", devices: 0, status: "connected", lastSync: "12 min ago" },
              { name: "New Holland", devices: 0, status: "connected", lastSync: "20 min ago" },
            ].map((provider) => (
              <Card
                key={provider.name}
                className={
                  provider.status === "error"
                    ? "border-red-200"
                    : provider.status === "warning"
                      ? "border-yellow-200"
                      : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{provider.name}</CardTitle>
                    {provider.status === "connected" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : provider.status === "warning" ? (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Devices:</span>
                      <span>{provider.devices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Sync:</span>
                      <span className={provider.status === "error" ? "text-red-600" : ""}>{provider.lastSync}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
