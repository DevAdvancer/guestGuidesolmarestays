"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ManualSection, ManualItem } from "@/lib/schema";

interface ManualAccordionProps {
  sections: (ManualSection & { items: ManualItem[] })[];
}

export function ManualAccordion({ sections }: ManualAccordionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-900 p-6 pb-0">House Manual</h2>

      <Accordion type="single" collapsible className="px-6 pb-4">
        {sections.map((section) => {
          const IconComponent = (Icons as any)[section.icon || "BookOpen"] || Icons.BookOpen;

          return (
            <AccordionItem key={section.id} value={String(section.id)} className="border-b border-gray-100 last:border-0">
              <AccordionTrigger className="py-5 hover:no-underline group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors">
                    <IconComponent className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-lg text-gray-900">{section.title}</span>
                    {section.subtitle && (
                      <p className="text-base text-gray-500">{section.subtitle}</p>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-5">
                <div className="space-y-4 pl-[64px]">
                  {/* Items */}
                  {section.items.map((item) => {
                    const ItemIcon = (Icons as any)[item.icon || "Info"] || Icons.Info;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex gap-4 p-4 rounded-lg",
                          item.highlight && "bg-gray-50 border border-gray-200"
                        )}
                      >
                        <ItemIcon className={cn(
                          "h-6 w-6 shrink-0 mt-0.5",
                          item.highlight ? "text-gray-900" : "text-gray-400"
                        )} strokeWidth={1.5} />
                        <div className="space-y-2">
                          <p className={cn(
                            "font-medium text-base",
                            item.highlight ? "text-gray-900" : "text-gray-900"
                          )}>
                            {item.label}
                            {item.highlight && (
                              <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded">
                                Important
                              </span>
                            )}
                          </p>
                          {item.value && (
                            <p className="text-gray-600 text-base whitespace-pre-wrap">{item.value}</p>
                          )}

                          {/* Bullet Points */}
                          {item.bullets && item.bullets.length > 0 && (
                            <ul className="space-y-2 mt-3">
                              {item.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-base text-gray-600">
                                  <span className="text-gray-400 mt-1">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {section.items.length === 0 && (
                    <p className="text-gray-400 text-base italic">No items in this section</p>
                  )}

                  {/* Checklist (for departure sections, etc.) */}
                  {section.checklist && section.checklist.length > 0 && (
                    <div className="mt-5 p-5 bg-gray-50 rounded-lg">
                      <h4 className="text-base font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                        Before You Leave
                      </h4>
                      <ul className="space-y-3">
                        {section.checklist.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-4 text-base text-gray-600">
                            <div className="w-6 h-6 rounded border-2 border-gray-300 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
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
