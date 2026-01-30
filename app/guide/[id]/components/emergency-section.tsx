"use client";

import { AlertTriangle } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmergencyItem } from "@/lib/schema";

interface EmergencySectionProps {
  items: EmergencyItem[];
}

export function EmergencySection({ items }: EmergencySectionProps) {

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="w-full flex items-center justify-between p-6 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <span className="font-semibold text-lg text-gray-900">Safety & Emergency</span>
            <p className="text-base text-gray-500">Important contacts & info</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 pt-0 mt-4">
        {items.map((item) => {
          const IconComponent = (Icons as any)[item.icon || "Phone"] || Icons.Phone;

          return (
            <div
              key={item.id}
              className={cn(
                "p-5 rounded-lg flex items-start gap-4",
                item.urgent ? "bg-red-50" : "bg-gray-50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                item.urgent ? "bg-red-100" : "bg-white"
              )}>
                <IconComponent className={cn(
                  "h-6 w-6",
                  item.urgent ? "text-red-600" : "text-gray-600"
                )} strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <h3 className={cn(
                  "font-semibold text-lg",
                  item.urgent ? "text-red-900" : "text-gray-900"
                )}>
                  {item.title}
                  {item.urgent && (
                    <span className="ml-2 text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full uppercase font-bold">
                      Urgent
                    </span>
                  )}
                </h3>
                {item.description && (
                  <p className="text-base text-gray-600 mt-1">{item.description}</p>
                )}

                {item.action && (
                  <a
                    href={item.action}
                    className={cn(
                      "inline-flex items-center gap-2 mt-4 text-base font-medium px-5 py-2.5 rounded-full transition-colors",
                      item.urgent
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                  >
                    {item.actionLabel || "Contact"}
                  </a>
                )}

                {item.address && (
                  <div className="mt-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-base text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <Icons.MapPin className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 mt-0.5" />
                      <span>{item.address}</span>
                    </a>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
