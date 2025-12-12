"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Categories() {
  const categories = [
    { id: 1, name: "Heavy Equipment", count: 45, icon: "🏗️" },
    { id: 2, name: "Light Equipment", count: 32, icon: "⚙️" },
    { id: 3, name: "Vehicles", count: 28, icon: "🚚" },
    { id: 4, name: "Small Tools & Accessories", count: 18, icon: "🔧" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Equipment Categories</h2>
          <p className="text-muted-foreground">Manage equipment categorization</p>
        </div>
        <Button>+ Add Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="font-semibold text-foreground">{cat.name}</h3>
            <p className="text-2xl font-bold text-accent mt-2">{cat.count}</p>
            <Button size="sm" variant="outline" className="w-full mt-4 bg-transparent">
              View Details
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
