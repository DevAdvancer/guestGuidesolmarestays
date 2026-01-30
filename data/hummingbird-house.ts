import { GuidebookConfig } from "@/types/guidebook"

export const guidebook: GuidebookConfig = {
  id: "hummingbird-house",
  title: "The Hummingbird House",
  subtitle: "Your guide to a perfect stay",
  heroImage: "/images/hero-property.jpg",
  address: "155 San Antonia Ave, Avila Beach",
  wifi: {
    network: "California",
    password: "Rudi2024!",
  },
  doorCode: "1512",
  pin: "1512",
  checkOutTime: "11:00 AM",
  host: {
    name: "Solmaré Management",
    phone: "+18052426411",
  },
  localGuideLink: "/local-guide",
  houseRules: [
    { id: "no-parties", label: "No Parties", icon: "PartyPopper" },
    { id: "no-smoking", label: "No Smoking", icon: "Cigarette" },
    { id: "quiet-hours", label: "Quiet 10pm-8am", icon: "Moon" },
  ],
  manualSections: [
    {
      id: "arrival",
      icon: "Car",
      title: "Arrival & Parking",
      subtitle: "Getting settled in",
      items: [
        {
          icon: "ParkingCircle",
          label: "Parking",
          value: "You have two designated spaces labeled 155 San Antonia in the private lot. Please only park here. Street parking is available but difficult to find in summer.",
        },
        {
          icon: "ShowerHead",
          label: "Outdoor Shower",
          value: "Located to the left of the first parking space. Please rinse off sand before entering!",
        },
        {
          icon: "Lock",
          label: "Gate Code",
          value: "The code for the side gate (trash access) and beach locker is 1207.",
          highlight: true,
        },
      ],
    },
    {
      id: "climate",
      icon: "Thermometer",
      title: "Climate & Comfort",
      subtitle: "Stay comfortable",
      items: [
        {
          icon: "Wind",
          label: "A/C & Heat",
          value: "Units are in each bedroom and the living room. Use the remote to choose heating/cooling and set your temperature. Please turn off when leaving.",
        },
        {
          icon: "Flame",
          label: "Fireplace",
          value: "Gas fireplace. The remote is in the top drawer to the left of the stove.",
        },
        {
          icon: "Blinds",
          label: "Living Room Blinds (Automated)",
          value: "Remote is in the top drawer left of the stove.",
          bullets: [
            "Positions 1 & 2: Total Blackout",
            "Position 3: Sun Block",
            "Note: Bedroom blinds are manual",
          ],
        },
      ],
    },
    {
      id: "amenities",
      icon: "Waves",
      title: "Amenities & Gear",
      subtitle: "Everything you need",
      items: [
        {
          icon: "Bike",
          label: "Beach Gear Locker",
          value: "Located to the right of the parking area (Label: 155). Code: 1207.",
          bullets: [
            "Includes: 2 Beach Cruisers, 4 Chairs, 4 Boogie Boards, Wagon, Cooler, Beach Towels",
            "Please leave dirty beach towels here on floor upon departure",
          ],
          highlight: true,
        },
        {
          icon: "Coffee",
          label: "Coffee",
          value: "Keurig Duo provided (Uses K-Cups or Grounds). Starter pods/tea provided. Carafe/filters are in the cupboard above.",
        },
        {
          icon: "ArrowUpRight",
          label: "Rooftop Deck",
          value: "Head up the stairs from the living room for panoramic views!",
        },
        {
          icon: "Tv",
          label: "Smart TVs",
          value: "Smart TVs in every room. Please use your personal streaming accounts and log out before leaving.",
        },
      ],
    },
    {
      id: "departure",
      icon: "Trash2",
      title: "Trash & Departure",
      subtitle: "Check-out is 11:00 AM",
      items: [
        {
          icon: "Recycle",
          label: "Trash & Recycling",
          value: "",
          bullets: [
            "Inside: Left of sink (Front = Trash, Back = Recycling)",
            "Outside: Bins are behind the locked gate off the master bedroom",
            "Gate Code: 1207",
            "Avila uses mixed-use recycling (bottles, cans, plastic, cardboard)",
          ],
        },
      ],
      checklist: [
        "Turn off all A/C and Heating units",
        "Start the dishwasher",
        "Take trash to outside bins",
        "Leave beach towels on the floor of the storage locker (1207)",
      ],
    },
  ],
  emergencyItems: [
    {
      title: "Emergency Services",
      description: "Police, Fire, Medical",
      icon: "Phone",
      action: "tel:911",
      actionLabel: "Dial 911",
      urgent: true,
    },
    {
      title: "Property Management",
      description: "For urgent property issues",
      icon: "Shield",
      action: "tel:+18052426411",
      actionLabel: "(805) 242-6411",
    },
    {
      title: "Nearest Hospital",
      description: "French Hospital Medical Center",
      icon: "Hospital",
      action: "https://www.google.com/maps/search/?api=1&query=French+Hospital+Medical+Center+1911+Johnson+Ave+San+Luis+Obispo+CA",
      actionLabel: "Get Directions",
    },
    {
      title: "Non-Emergency Police",
      description: "SLO Sheriff",
      icon: "Phone",
      action: "tel:+18057817312",
      actionLabel: "(805) 781-7312",
    },
    {
      title: "Fire Extinguisher",
      description: "Kitchen (Under Sink)",
      icon: "Flame",
    },
  ],
}
