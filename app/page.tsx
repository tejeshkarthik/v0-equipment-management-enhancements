"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/views/dashboard"
import EquipmentMaster from "@/components/views/equipment-master"
import SchedulingView from "@/components/views/scheduling-view"
import LorTracking from "@/components/views/lor-tracking"
import FieldInspections from "@/components/views/field-inspections"
import Settings from "@/components/views/settings"
import FleetMap from "@/components/views/fleet-map"
import WorkOrders from "@/components/views/work-orders"
import Issues from "@/components/views/issues"
import Analytics from "@/components/views/analytics"
import Reports from "@/components/views/reports"
import Categories from "@/components/views/categories"
import Assets from "@/components/views/assets"
import CheckInOut from "@/components/views/check-in-out"
import Utilization from "@/components/views/utilization"
import PMSchedule from "@/components/views/pm-schedule"
import RateCards from "@/components/views/rate-cards"
import ThirdPartyRentals from "@/components/views/third-party-rentals"
import HaulingTransport from "@/components/views/hauling-transport"
import Telematics from "@/components/views/telematics"
import AssetLifecycle from "@/components/views/asset-lifecycle"
import AssetCreation from "@/components/views/asset-creation" // Import Asset Creation view
import FinancialReconciliation from "@/components/views/financial-reconciliation" // Import Financial Reconciliation view
import CustomerBilling from "@/components/views/customer-billing" // Import Customer Billing view

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
  | "asset-creation" // Added Asset Creation view type
  | "financial-reconciliation" // Added Financial Reconciliation view type
  | "customer-billing" // Added Customer Billing view type
  | "settings"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />
      case "fleet-map":
        return <FleetMap />
      case "analytics":
        return <Analytics />
      case "reports":
        return <Reports />
      case "equipment-master":
        return <EquipmentMaster />
      case "categories":
        return <Categories />
      case "assets":
        return <Assets />
      case "scheduling":
        return <SchedulingView />
      case "requests":
        return <LorTracking />
      case "check-in-out":
        return <CheckInOut />
      case "utilization":
        return <Utilization />
      case "inspections":
        return <FieldInspections />
      case "work-orders":
        return <WorkOrders />
      case "issues":
        return <Issues />
      case "pm-schedule":
        return <PMSchedule />
      case "rate-cards":
        return <RateCards />
      case "third-party-rentals":
        return <ThirdPartyRentals />
      case "hauling-transport":
        return <HaulingTransport />
      case "telematics":
        return <Telematics />
      case "asset-lifecycle":
        return <AssetLifecycle />
      case "asset-creation": // Added Asset Creation route
        return <AssetCreation />
      case "financial-reconciliation": // Added Financial Reconciliation route
        return <FinancialReconciliation />
      case "customer-billing": // Added Customer Billing route
        return <CustomerBilling />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderView()}</div>
    </div>
  )
}
