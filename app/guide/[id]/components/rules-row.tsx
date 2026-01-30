"use client";

import * as Icons from "lucide-react";
import { X } from "lucide-react";
import type { HouseRule } from "@/lib/schema";

interface RulesRowProps {
  rules: HouseRule[];
}

export function RulesRow({ rules }: RulesRowProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-center flex-wrap gap-8">
        {rules.map((rule) => {
          const IconComponent = (Icons as any)[rule.icon || "AlertCircle"] || Icons.AlertCircle;
          const isNoRule = rule.label.toLowerCase().startsWith("no ");

          return (
            <div
              key={rule.id}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center" title={rule.label}>
                <IconComponent className="h-7 w-7 text-blue-600" strokeWidth={1.5} />
                {isNoRule && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="h-10 w-10 text-blue-600/40" strokeWidth={2} />
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center max-w-[100px] leading-tight">
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
