"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Copy, Plus, Edit, ChevronRight } from "lucide-react"
import { useState } from "react"

const templates = [
  {
    id: 1,
    name: "Heavy Equipment Standard Rates",
    equipmentTypes: 8,
    lastUpdated: "2025-11-10",
    rates: [
      { type: "Excavator", hourly: 125, daily: 800, weekly: 4200, monthly: 15000, internal: 100 },
      { type: "Dozer", hourly: 150, daily: 950, weekly: 5200, monthly: 18000, internal: 120 },
      { type: "Dump Truck", hourly: 95, daily: 600, weekly: 3200, monthly: 12000, internal: 75 },
      { type: "Generator", hourly: 65, daily: 400, weekly: 2100, monthly: 8000, internal: 50 },
      { type: "Crane", hourly: 350, daily: 2200, weekly: 12000, monthly: 45000, internal: 280 },
    ],
  },
  {
    id: 2,
    name: "Marine Equipment Rates",
    equipmentTypes: 4,
    lastUpdated: "2025-11-08",
    rates: [],
  },
  {
    id: 3,
    name: "Light Equipment Rates",
    equipmentTypes: 3,
    lastUpdated: "2025-11-05",
    rates: [],
  },
]

const equipmentCategories = [
  { name: "Heavy Equipment", count: 12 },
  { name: "Light Equipment", count: 8 },
  { name: "Vehicles", count: 6 },
  { name: "Tools", count: 15 },
  { name: "Accessories", count: 20 },
]

const businessUnits = [
  { code: "FVS", name: "Five-S Group", company: "FIVES-001", equipment: 187, active: true },
  { code: "MAR", name: "Five-S Marine", company: "FIVES-002", equipment: 95, active: true },
  { code: "SSS", name: "Southern Stone & Sand", company: "FIVES-003", equipment: 120, active: true },
]

const approvalWorkflows = [
  {
    name: "Equipment Requisition Approval",
    type: "All must approve",
    levels: 3,
  },
  {
    name: "Work Order Approval",
    type: "Any one can approve",
    levels: 2,
  },
  {
    name: "Parts Requisition Approval",
    type: "All must approve",
    levels: 2,
  },
]

const menuItems = [
  { id: "rates", label: "Rate Card Templates", icon: "💰" },
  { id: "equipment", label: "Equipment Setup", icon: "📦" },
  { id: "units", label: "Business Units", icon: "🏢" },
  { id: "workflows", label: "Approval Workflows", icon: "⚙️" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
]

export default function Settings() {
  const [activeMenu, setActiveMenu] = useState("rates")
  const [editingTemplate, setEditingTemplate] = useState<(typeof templates)[0] | null>(null)
  const [editedRates, setEditedRates] = useState<any[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedBU, setExpandedBU] = useState<string | null>(null)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)

  const handleEditTemplate = (template: (typeof templates)[0]) => {
    setEditingTemplate(template)
    setEditedRates(template.rates)
  }

  const handleSaveRates = () => {
    setEditingTemplate(null)
  }

  return (
    <div className="p-6 flex gap-6 max-w-6xl mx-auto">
      {/* Left Sidebar */}
      <div className="w-48">
        <Card className="p-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeMenu === item.id
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Rate Card Templates */}
        {activeMenu === "rates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Rate Card Templates</h2>
                <p className="text-sm text-muted-foreground">Manage equipment pricing templates</p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                New Template
              </Button>
            </div>

            {/* Template Cards */}
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleEditTemplate(template)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Applies to {template.equipmentTypes} types</p>
                      <p className="text-xs text-muted-foreground mt-1">Updated: {template.lastUpdated}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Edit Modal */}
            {editingTemplate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-96 overflow-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground">{editingTemplate.name}</h3>
                      <button
                        onClick={() => setEditingTemplate(null)}
                        className="text-2xl text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>

                    {/* Rates Table */}
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Type</th>
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Hourly</th>
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Daily</th>
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Weekly</th>
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Monthly</th>
                            <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Internal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editedRates.map((rate, idx) => (
                            <tr key={idx} className="border-b border-border">
                              <td className="py-2 px-4 font-medium text-foreground">{rate.type}</td>
                              <td className="py-2 px-4">
                                <Input
                                  value={rate.hourly}
                                  onChange={(e) => {
                                    const newRates = [...editedRates]
                                    newRates[idx].hourly = Number.parseInt(e.target.value) || 0
                                    setEditedRates(newRates)
                                  }}
                                  className="w-24"
                                />
                              </td>
                              <td className="py-2 px-4">
                                <Input
                                  value={rate.daily}
                                  onChange={(e) => {
                                    const newRates = [...editedRates]
                                    newRates[idx].daily = Number.parseInt(e.target.value) || 0
                                    setEditedRates(newRates)
                                  }}
                                  className="w-24"
                                />
                              </td>
                              <td className="py-2 px-4">
                                <Input
                                  value={rate.weekly}
                                  onChange={(e) => {
                                    const newRates = [...editedRates]
                                    newRates[idx].weekly = Number.parseInt(e.target.value) || 0
                                    setEditedRates(newRates)
                                  }}
                                  className="w-24"
                                />
                              </td>
                              <td className="py-2 px-4">
                                <Input
                                  value={rate.monthly}
                                  onChange={(e) => {
                                    const newRates = [...editedRates]
                                    newRates[idx].monthly = Number.parseInt(e.target.value) || 0
                                    setEditedRates(newRates)
                                  }}
                                  className="w-24"
                                />
                              </td>
                              <td className="py-2 px-4">
                                <Input
                                  value={rate.internal}
                                  onChange={(e) => {
                                    const newRates = [...editedRates]
                                    newRates[idx].internal = Number.parseInt(e.target.value) || 0
                                    setEditedRates(newRates)
                                  }}
                                  className="w-24"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                        Cancel
                      </Button>
                      <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveRates}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Equipment Setup */}
        {activeMenu === "equipment" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Equipment Setup</h2>
              <p className="text-sm text-muted-foreground">Configure equipment categories and types</p>
            </div>

            <div className="grid gap-4">
              {equipmentCategories.map((category) => (
                <Card
                  key={category.name}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} equipment types</p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedCategory === category.name ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {expandedCategory === category.name && (
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Example types:</div>
                      </div>
                      <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90">
                        <Plus className="w-4 h-4" />
                        Add Type
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Business Units */}
        {activeMenu === "units" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Business Units</h2>
                <p className="text-sm text-muted-foreground">Manage your company's business units</p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                Add Business Unit
              </Button>
            </div>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">BU Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Business Unit Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Vista Company</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Equipment Count</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessUnits.map((bu) => (
                    <tr key={bu.code} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{bu.code}</td>
                      <td className="py-3 px-4 text-foreground">{bu.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{bu.company}</td>
                      <td className="py-3 px-4 text-foreground">{bu.equipment} units</td>
                      <td className="py-3 px-4">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-foreground text-xs">Active</span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          View Equipment
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approval Workflows */}
        {activeMenu === "workflows" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Approval Workflows</h2>
                <p className="text-sm text-muted-foreground">Configure approval requirements and workflows</p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                Create Workflow
              </Button>
            </div>

            <div className="grid gap-4">
              {approvalWorkflows.map((workflow) => (
                <Card
                  key={workflow.name}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.name ? null : workflow.name)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="text-muted-foreground">Type: {workflow.type}</span>
                        <span className="text-muted-foreground">{workflow.levels} approval levels</span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedWorkflow === workflow.name ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {expandedWorkflow === workflow.name && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {[1, 2, 3].map((level) => {
                        if (level > workflow.levels) return null
                        return (
                          <div key={level} className="bg-muted/50 p-3 rounded-lg">
                            <p className="font-medium text-foreground text-sm">Level {level}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {level === 1 && "Site Superintendent, Project Manager"}
                              {level === 2 && "Equipment Coordinator, Lindsey Foster"}
                              {level === 3 && "Head Office Manager, André Smith"}
                            </p>
                          </div>
                        )
                      })}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeMenu === "integrations" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Integrations</h2>
              <p className="text-sm text-muted-foreground">Manage external service integrations</p>
            </div>

            <div className="grid gap-4">
              {[
                { name: "Telematics Providers", status: "2 Active", lastSync: "5 minutes ago" },
                { name: "Vista ERP Integration", status: "Connected", lastSync: "11/11/2025 10:00 AM" },
                { name: "Weather API", status: "Active", lastSync: "Daily at 4:00 AM" },
              ].map((integration) => (
                <Card key={integration.name} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Status: {integration.status}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last Sync: {integration.lastSync}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Configure
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
