"use client"

import { Input } from "@/components/ui/input"
import { Bell, Search, User } from "lucide-react"

type PrimarySection = "overview" | "equipment" | "operations" | "maintenance" | "settings"

type ViewType =
  | "dashboard"
  | "fleet-map"
  | "analytics"
  | "reports"
  | "equipment-master"
  | "categories"
  | "assets"
  | "scheduling"
  | "requests"
  | "check-in-out"
  | "utilization"
  | "inspections"
  | "work-orders"
  | "issues"
  | "pm-schedule"
  | "rate-cards"
  | "third-party-rentals"
  | "hauling-transport"
  | "telematics"
  | "asset-lifecycle"
  | "asset-creation" // Added Asset Creation view
  | "financial-reconciliation" // Added Financial Reconciliation view
  | "customer-billing" // Added Customer Billing view
  | "settings"

interface NavigationProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

const primarySections: {
  id: PrimarySection
  label: string
  icon: string
}[] = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "equipment", label: "Equipment", icon: "📦" },
  { id: "operations", label: "Operations", icon: "📋" },
  { id: "maintenance", label: "Maintenance", icon: "🔧" },
  { id: "settings", label: "Settings", icon: "⚙️" },
]

const secondaryNavigation: Record<PrimarySection, { id: ViewType; label: string }[]> = {
  overview: [
    { id: "dashboard", label: "Dashboard" },
    { id: "fleet-map", label: "Fleet Map" },
    { id: "analytics", label: "Analytics" },
    { id: "reports", label: "Reports" },
  ],
  equipment: [
    { id: "equipment-master", label: "Equipment Master" },
    { id: "categories", label: "Categories" },
    { id: "assets", label: "Assets" },
    { id: "asset-lifecycle", label: "Asset Lifecycle" },
    { id: "asset-creation", label: "Asset Creation" }, // Added Asset Creation tab to Equipment section
  ],
  operations: [
    { id: "scheduling", label: "Scheduling" },
    { id: "requests", label: "Requests" },
    { id: "check-in-out", label: "Check-In/Out" },
    { id: "utilization", label: "Utilization" },
    { id: "rate-cards", label: "Rate Cards & Billing" },
    { id: "financial-reconciliation", label: "Financial Reconciliation" }, // Added Financial Reconciliation tab
    { id: "customer-billing", label: "Customer Billing" }, // Added Customer Billing tab
    { id: "third-party-rentals", label: "Third-Party Rentals" },
    { id: "hauling-transport", label: "Hauling & Transport" },
    { id: "telematics", label: "Telematics & Geofencing" },
  ],
  maintenance: [
    { id: "inspections", label: "Field Inspections" },
    { id: "work-orders", label: "Work Orders" },
    { id: "issues", label: "Issues" },
    { id: "pm-schedule", label: "PM Schedule" },
  ],
  settings: [{ id: "settings", label: "Settings" }],
}

const getPrimarySectionFromView = (view: ViewType): PrimarySection => {
  for (const [section, items] of Object.entries(secondaryNavigation)) {
    if (items.some((item) => item.id === view)) {
      return section as PrimarySection
    }
  }
  return "overview"
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const activePrimarySection = getPrimarySectionFromView(currentView as ViewType)
  const activeSecondaryItems = secondaryNavigation[activePrimarySection]

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-40">
      {/* Primary Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 gap-6 border-b border-border">
        {/* Left - Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">EM</span>
          </div>
          <h1 className="text-lg font-bold text-foreground hidden sm:block">Arena Equipment Management</h1>
        </div>

        {/* Center - Primary Navigation */}
        <div className="flex-1 flex items-center gap-1">
          {primarySections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const firstView = secondaryNavigation[section.id as PrimarySection][0].id
                onNavigate(firstView)
              }}
              className={`px-4 py-2 flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors relative ${
                activePrimarySection === section.id
                  ? "text-accent font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
              {activePrimarySection === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Right - Search, Notifications, User */}
        <div className="flex items-center gap-4 min-w-fit">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 pr-4 py-2 w-48 text-sm" />
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="flex gap-2 px-6 py-2 bg-white dark:bg-slate-950 overflow-x-auto">
        {activeSecondaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded ${
              currentView === item.id
                ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
