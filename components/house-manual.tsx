"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Car, 
  Thermometer, 
  Waves, 
  Trash2, 
  ParkingCircle, 
  ShowerHead, 
  Lock,
  Wind,
  Flame,
  Blinds,
  Bike,
  Coffee,
  Tv,
  ArrowUpRight,
  Recycle,
  CheckSquare,
  Clock
} from "lucide-react"

type ManualItem = {
  icon: React.ElementType
  label: string
  value: string
  bullets?: string[]
  highlight?: boolean
}

type ManualSection = {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  items: ManualItem[]
  checklist?: string[]
}

const manualSections: ManualSection[] = [
  {
    id: "arrival",
    icon: Car,
    title: "Arrival & Parking",
    subtitle: "Getting settled in",
    items: [
      {
        icon: ParkingCircle,
        label: "Parking",
        value: "You have two designated spaces labeled 155 San Antonia in the private lot. Please only park here. Street parking is available but difficult to find in summer.",
      },
      {
        icon: ShowerHead,
        label: "Outdoor Shower",
        value: "Located to the left of the first parking space. Please rinse off sand before entering!",
      },
      {
        icon: Lock,
        label: "Gate Code",
        value: "The code for the side gate (trash access) and beach locker is 1207.",
        highlight: true,
      },
    ],
  },
  {
    id: "climate",
    icon: Thermometer,
    title: "Climate & Comfort",
    subtitle: "Stay comfortable",
    items: [
      {
        icon: Wind,
        label: "A/C & Heat",
        value: "Units are in each bedroom and the living room. Use the remote to choose heating/cooling and set your temperature. Please turn off when leaving.",
      },
      {
        icon: Flame,
        label: "Fireplace",
        value: "Gas fireplace. The remote is in the top drawer to the left of the stove.",
      },
      {
        icon: Blinds,
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
    icon: Waves,
    title: "Amenities & Gear",
    subtitle: "Everything you need",
    items: [
      {
        icon: Bike,
        label: "Beach Gear Locker",
        value: "Located to the right of the parking area (Label: 155). Code: 1207.",
        bullets: [
          "Includes: 2 Beach Cruisers, 4 Chairs, 4 Boogie Boards, Wagon, Cooler, Beach Towels",
          "Please leave dirty beach towels here on floor upon departure",
        ],
        highlight: true,
      },
      {
        icon: Coffee,
        label: "Coffee",
        value: "Keurig Duo provided (Uses K-Cups or Grounds). Starter pods/tea provided. Carafe/filters are in the cupboard above.",
      },
      {
        icon: ArrowUpRight,
        label: "Rooftop Deck",
        value: "Head up the stairs from the living room for panoramic views!",
      },
      {
        icon: Tv,
        label: "Smart TVs",
        value: "Smart TVs in every room. Please use your personal streaming accounts and log out before leaving.",
      },
    ],
  },
  {
    id: "departure",
    icon: Trash2,
    title: "Trash & Departure",
    subtitle: "Check-out is 11:00 AM",
    items: [
      {
        icon: Recycle,
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
]

export function HouseManual() {
  const [openSection, setOpenSection] = useState<string | undefined>(undefined)

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#departure-section") {
        // First scroll to the element
        const element = document.getElementById("departure-section")
        if (element) {
          const elementRect = element.getBoundingClientRect()
          const absoluteElementTop = elementRect.top + window.pageYOffset
          const offset = 80 // Account for any fixed headers
          
          window.scrollTo({
            top: absoluteElementTop - offset,
            behavior: "smooth"
          })
          
          // Then open the accordion after a short delay for smooth sequencing
          setTimeout(() => {
            setOpenSection("departure")
          }, 300)
        }
        
        // Clear the hash after animation completes
        setTimeout(() => {
          history.replaceState(null, "", window.location.pathname)
        }, 800)
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-3">House Manual</h2>
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-2"
        value={openSection}
        onValueChange={setOpenSection}
      >
        {manualSections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            id={section.id === "departure" ? "departure-section" : undefined}
            className="border border-border rounded-xl overflow-hidden bg-card [&]:border-b"
          >
            <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground block">{section.title}</span>
                  <span className="text-xs text-muted-foreground">{section.subtitle}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                {section.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-3 p-3 rounded-lg ${item.highlight ? "bg-primary/5 border border-primary/20" : "bg-accent/30"}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{item.label}</p>
                      {item.value && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.value}</p>
                      )}
                      {item.bullets && (
                        <ul className="mt-1.5 space-y-1">
                          {item.bullets.map((bullet, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
                
                {section.checklist && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Check-out by 11:00 AM</span>
                    </div>
                    <ul className="space-y-2">
                      {section.checklist.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-amber-800 dark:text-amber-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
