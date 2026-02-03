"use client";

import { useState } from "react";
import { LocalGuideVendor } from "@/lib/schema";
import { LocalHero } from "./local-hero";
import { VipCarousel } from "./vip-carousel";
import { CategoryTabs } from "./category-tabs";
import { VendorList } from "./vendor-list";

interface LocalGuideContentProps {
  vipVendors: LocalGuideVendor[];
  standardVendors: LocalGuideVendor[];
}

export function LocalGuideContent({ vipVendors, standardVendors }: LocalGuideContentProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-[#fdf9f8]">
      {/* 1. Hero Section */}
      <div className="mb-10">
        <LocalHero />
      </div>

      {/* 2. VIP Guest Exclusives (Carousel) */}
      {vipVendors.length > 0 && (
        <section className="py-8 border-b border-[#e5e7eb]/50">
          {/* Header purely for semantic structure, design implies carousel is immediate */}
          <VipCarousel vendors={vipVendors} />
        </section>
      )}

      {/* 3. Category Navigation (Sticky) & 4. Main Recommendation List */}
      <section className="min-h-screen">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="max-w-md mx-auto px-4 py-8">
          <VendorList
            vendors={standardVendors}
            activeCategory={activeCategory}
          />
        </div>
      </section>
    </div>
  );
}
