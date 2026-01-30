import { LucideIcon } from "lucide-react"

export interface GuidebookConfig {
  id: string
  title: string
  subtitle: string
  heroImage: string
  address: string
  wifi: {
    network: string
    password: string
  }
  doorCode: string
  pin: string
  checkOutTime: string
  houseRules: HouseRule[]
  manualSections: ManualSection[]
  emergencyItems: EmergencyItem[]
  host: {
    name: string
    phone: string
    email?: string
  }
  localGuideLink?: string
}

export interface HouseRule {
  id: string
  label: string
  icon: string // Lucide icon name
}

export interface ManualSection {
  id: string
  title: string
  subtitle: string
  icon: string // Lucide icon name
  items: ManualItem[]
  checklist?: string[]
}

export interface ManualItem {
  label: string
  value: string
  icon: string // Lucide icon name
  bullets?: string[]
  highlight?: boolean
}

export interface EmergencyItem {
  title: string
  description: string
  icon: string // Lucide icon name
  actionLabel?: string
  action?: string
  urgent?: boolean
}
