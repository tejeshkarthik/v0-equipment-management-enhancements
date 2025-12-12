"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function Reports() {
  const reports = [
    {
      id: 1,
      name: "Fleet Utilization Report",
      description: "Equipment utilization by category and business unit",
      generated: "11/12/2025",
    },
    {
      id: 2,
      name: "Revenue & Profitability Report",
      description: "Project-level revenue, costs, and profit margins",
      generated: "11/10/2025",
    },
    {
      id: 3,
      name: "Maintenance & Issues Report",
      description: "Maintenance schedules, work orders, and issue tracking",
      generated: "11/08/2025",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reports</h2>
        <p className="text-muted-foreground">Generated reports and data exports</p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id} className="p-4 flex items-start justify-between hover:bg-muted transition-colors">
            <div>
              <h3 className="font-semibold text-foreground">{report.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Generated: {report.generated}</p>
            </div>
            <Button size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
