"use client";

import { AlertTriangle } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { EmergencyItem } from "@/lib/schema";

interface EmergencySectionProps {
  items: EmergencyItem[];
}

export function EmergencySection({ items }: EmergencySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900 block">Safety & Emergency</span>
            <p className="text-base text-gray-500 font-medium">Important contacts & info</p>
          </div>
        </div>
        <Icons.ChevronDown
          className={cn(
            "h-5 w-5 text-gray-400 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="p-6 grid gap-4">
            {items.map((item) => {
              const IconComponent = (Icons as any)[item.icon || "Phone"] || Icons.Phone;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-5 rounded-xl flex items-start gap-5 transition-all",
                    "bg-white border hover:shadow-md",
                    item.urgent
                      ? "border-l-4 border-l-red-500 border-y-gray-100 border-r-gray-100"
                      : "border-gray-100"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    item.urgent ? "bg-red-50" : "bg-gray-50"
                  )}>
                    <IconComponent className={cn(
                      "h-6 w-6",
                      item.urgent ? "text-red-600" : "text-gray-600"
                    )} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={cn(
                        "font-bold text-lg",
                        item.urgent ? "text-gray-900" : "text-gray-900"
                      )}>
                        {item.title}
                      </h3>
                      {item.urgent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
                    )}

                    {item.action && (
                      <a
                        href={item.action}
                        className={cn(
                          "inline-flex items-center gap-2 mt-4 text-sm font-bold px-6 py-3 rounded-full transition-colors shadow-sm",
                          item.urgent
                            ? "bg-[#556D78] text-white hover:bg-[#4A5F69]"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        )}
                      >
                        {item.actionLabel || "Contact"}
                      </a>
                    )}

                    {item.address && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2.5 text-base text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                          <Icons.MapPin className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 mt-0.5" />
                          <span className="font-medium">{item.address}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
