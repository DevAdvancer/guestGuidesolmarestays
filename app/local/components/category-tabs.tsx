"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee & Casual" },
  { id: "dinner", label: "Dinner & Drinks" },
  { id: "play", label: "Play & Explore" },
  { id: "shops", label: "Shops & Markets" },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-[64px] z-30 bg-[#fdf9f8]/95 backdrop-blur-sm border-b border-[#e5e7eb] transition-all w-full">
      <div className="flex justify-start md:justify-center overflow-x-auto scrollbar-hide w-full">
        <div className="flex space-x-6 md:space-x-8 px-4 md:px-6 min-w-max">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "py-4 text-sm font-medium tracking-wide transition-all whitespace-nowrap border-b-2 focus:outline-none",
                "mb-[-1px]", // Pull border down to overlap container border
                activeCategory === category.id
                  ? "border-[#556D78] text-[#556D78]"
                  : "border-transparent text-[#B1BFBF] hover:text-[#556D78]"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
