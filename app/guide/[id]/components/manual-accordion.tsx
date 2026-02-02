"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ManualSection, ManualItem } from "@/lib/schema";
import { useEffect, useState } from "react";

interface ManualAccordionProps {
  sections: (ManualSection & { items: ManualItem[] })[];
}

export function ManualAccordion({ sections }: ManualAccordionProps) {
  const [openItem, setOpenItem] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#departure-section") {
        // Find departure section
        const departureSection = sections.find(s =>
          s.title.toLowerCase().includes("departure") ||
          s.title.toLowerCase().includes("check-out") ||
          s.title.toLowerCase().includes("checkout")
        );

        if (departureSection) {
          setOpenItem(String(departureSection.id));
          // Wait for accordion to open then scroll
          setTimeout(() => {
            const element = document.getElementById("departure-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sections]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-[#556D78] mb-6 px-2">House Manual</h2>

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {sections.map((section) => {
          const IconComponent = (Icons as any)[section.icon || "BookOpen"] || Icons.BookOpen;
          const isDeparture = section.title.toLowerCase().includes("departure") ||
            section.title.toLowerCase().includes("check-out") ||
            section.title.toLowerCase().includes("checkout");

          return (
            <AccordionItem
              key={section.id}
              value={String(section.id)}
              id={isDeparture ? "departure-section" : undefined}
              className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline group hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-5 text-left">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <IconComponent className="h-6 w-6 text-[#556D78]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-gray-900 block">{section.title}</span>
                    {section.subtitle && (
                      <p className="text-sm text-gray-500 mt-0.5 font-medium">{section.subtitle}</p>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-4 pl-[68px]">
                  {/* Items */}
                  {section.items.map((item) => {
                    const ItemIcon = (Icons as any)[item.icon || "Info"] || Icons.Info;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative group/item",
                          item.highlight ? "bg-[#556D78]/5 p-4 rounded-xl border border-[#556D78]/10" : "py-2"
                        )}
                      >
                        <div className="flex gap-4">
                          <ItemIcon className={cn(
                            "h-5 w-5 shrink-0 mt-0.5",
                            item.highlight ? "text-[#556D78]" : "text-gray-400"
                          )} strokeWidth={1.5} />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                "font-medium text-base",
                                item.highlight ? "text-[#556D78]" : "text-gray-900"
                              )}>
                                {item.label}
                              </p>
                              {item.highlight && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#556D78] text-white px-2 py-0.5 rounded-full">
                                  Important
                                </span>
                              )}
                            </div>

                            {item.value && (
                              <p className="text-gray-600 text-base whitespace-pre-wrap leading-relaxed">
                                {item.value}
                              </p>
                            )}

                            {/* Bullet Points */}
                            {item.bullets && item.bullets.length > 0 && (
                              <ul className="space-y-2 mt-3 bg-gray-50/80 p-4 rounded-lg">
                                {item.bullets.map((bullet, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#556D78]/40 mt-1.5 shrink-0" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {section.items.length === 0 && (
                    <p className="text-gray-400 text-sm italic pl-9">No specific details listed.</p>
                  )}

                  {/* Checklist (for departure sections, etc.) */}
                  {section.checklist && section.checklist.length > 0 && (
                    <div className="mt-4 p-5 bg-[#556D78]/5 rounded-xl border border-[#556D78]/10">
                      <h4 className="text-sm font-semibold text-[#556D78] mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                        Action Items
                      </h4>
                      <ul className="space-y-3">
                        {section.checklist.map((item, idx) => {
                          const itemId = `${section.id}-${idx}`;
                          const isChecked = checkedItems[itemId];

                          return (
                            <li
                              key={idx}
                              onClick={() => {
                                setCheckedItems(prev => ({
                                  ...prev,
                                  [itemId]: !prev[itemId]
                                }));
                              }}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-md shadow-sm border transition-all cursor-pointer group hover:border-[#556D78]/30",
                                isChecked
                                  ? "bg-gray-50 border-gray-100"
                                  : "bg-white border-gray-100"
                              )}
                            >
                              <div className={cn(
                                "mt-0.5 shrink-0 transition-colors",
                                isChecked ? "text-[#556D78]" : "text-gray-300 group-hover:text-gray-400"
                              )}>
                                {isChecked ? (
                                  <Icons.CheckSquare className="w-5 h-5" strokeWidth={2} />
                                ) : (
                                  <Icons.Square className="w-5 h-5" strokeWidth={2} />
                                )}
                              </div>
                              <span className={cn(
                                "leading-snug transition-colors",
                                isChecked ? "text-gray-400 line-through" : "text-gray-700"
                              )}>
                                {item}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
