"use client";

import { LocalGuideVendor } from "@/lib/schema";
import { VipFlipCard } from "./vip-flip-card";

interface VipCarouselProps {
  vendors: LocalGuideVendor[];
}

export function VipCarousel({ vendors }: VipCarouselProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Visual Cue: Overflow visible to encourage scrolling */}
      <div className="flex overflow-x-auto gap-6 px-4 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="snap-center flex-shrink-0 w-[85vw] sm:w-[320px]">
            <VipFlipCard vendor={vendor} />
          </div>
        ))}

        {/* Spacer for right edge scrolling */}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
}
