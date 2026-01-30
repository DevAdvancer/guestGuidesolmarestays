import { GuidebookConfig } from "@/types/guidebook"

export const guidebook: GuidebookConfig = {
  id: "seaside-villa",
  title: "Seaside Villa",
  subtitle: "Luxury Oceanfront Living",
  heroImage: "/images/hero-property.jpg",
  address: "200 Ocean Ave, Pismo Beach",
  wifi: {
    network: "SeasideGuest",
    password: "BeachLife2024",
  },
  doorCode: "2024",
  pin: "8888",
  checkOutTime: "10:00 AM",
  host: {
    name: "Seaside Management",
    phone: "+18055550000",
  },
  localGuideLink: "/local-guide",
  houseRules: [
    { id: "no-parties", label: "No Parties", icon: "PartyPopper" },
    { id: "no-pets", label: "No Pets", icon: "Cat" },
  ],
  manualSections: [],
  emergencyItems: [],
}
