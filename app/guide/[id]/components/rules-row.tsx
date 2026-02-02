"use client";

import * as Icons from "lucide-react";
import { X } from "lucide-react";
import type { HouseRule } from "@/lib/schema";

interface RulesRowProps {
  rules: HouseRule[];
}

export function RulesRow({ rules }: RulesRowProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-center flex-wrap gap-8 md:gap-12">
        {rules.map((rule) => {
          const IconComponent = (Icons as any)[rule.icon || "AlertCircle"] || Icons.AlertCircle;
          const isNoRule = rule.label.toLowerCase().startsWith("no ");

          return (
            <div
              key={rule.id}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative flex items-center justify-center p-2" title={rule.label}>
                <IconComponent className="h-8 w-8 text-[#556D78]" strokeWidth={1.5} />
                {isNoRule && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="h-10 w-10 text-[#556D78]/50" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-[#556D78]/90 text-center max-w-[100px] leading-tight uppercase tracking-wide">
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
