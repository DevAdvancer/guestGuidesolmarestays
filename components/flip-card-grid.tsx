"use client"

import CardFlip from "@/components/ui/flip-card"

export default function FlipCardGrid() {
  const cards = [
    {
      title: "Design System",
      subtitle: "Consistent & Beautiful",
      description: "A comprehensive design system ensuring consistency across your entire application.",
      features: [
        "Design Tokens",
        "Type Scale",
        "Color Palette",
        "Iconography",
      ],
      color: "#3b82f6", // Blue
    },
    {
      title: "Fast Performance",
      subtitle: "Lightning Speed",
      description: "Optimized for speed with zero-runtime CSS and efficient code splitting.",
      features: [
        "Zero Runtime",
        "Tree Shaking",
        "Lazy Loading",
        "Edge Ready",
      ],
      color: "#8b5cf6", // Violet
    },
    {
      title: "Secure & Safe",
      subtitle: "Enterprise Grade",
      description: "Built with security first principles to protect your data and users.",
      features: [
        "Encryption",
        "Auth Ready",
        "Role Based",
        "Audit Logs",
      ],
      color: "#10b981", // Emerald
    },
    {
      title: "Accessibility",
      subtitle: "For Everyone",
      description: "Fully accessible components following WAI-ARIA guidelines out of the box.",
      features: [
        "Screen Readers",
        "Keyboard Nav",
        "Focus Mgmt",
        "Contrast Safe",
      ],
      color: "#f59e0b", // Amber
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {cards.map((card, index) => (
        <div key={index} className="flex justify-center">
          <CardFlip {...card} />
        </div>
      ))}
    </div>
  )
}
