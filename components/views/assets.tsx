"use client"

import { Card } from "@/components/ui/card"

export default function Assets() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Assets</h2>
        <p className="text-muted-foreground">Asset inventory and management</p>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">Asset inventory view - coming soon</p>
      </Card>
    </div>
  )
}
