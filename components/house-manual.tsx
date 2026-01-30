"use client"

import React from "react"
import { useState, useEffect } from "react"
import { ManualSection } from "@/types/guidebook"
import * as LucideIcons from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LucideIcon, Clock, CheckSquare } from "lucide-react"

interface HouseManualProps {
  sections: ManualSection[]
}

export function HouseManual({ sections }: HouseManualProps) {
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
        {sections.map((section) => {
          const SectionIcon = (LucideIcons[section.icon as keyof typeof LucideIcons] || LucideIcons.HelpCircle) as LucideIcon

          return (
            <AccordionItem
              key={section.id}
              value={section.id}
              id={section.id === "departure" ? "departure-section" : undefined}
              className="border border-border rounded-xl overflow-hidden bg-card [&]:border-b"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <SectionIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-foreground block">{section.title}</span>
                    <span className="text-xs text-muted-foreground">{section.subtitle}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  {section.items.map((item, index) => {
                    const ItemIcon = (LucideIcons[item.icon as keyof typeof LucideIcons] || LucideIcons.HelpCircle) as LucideIcon

                    return (
                      <div
                        key={index}
                        className={`flex gap-3 p-3 rounded-lg ${item.highlight ? "bg-primary/5 border border-primary/20" : "bg-accent/30"}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0">
                          <ItemIcon className="w-4 h-4 text-primary" />
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
                    )
                  })}

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
          )
        })}
      </Accordion>
    </section>
  )
}
