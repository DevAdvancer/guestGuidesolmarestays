"use client";

import { LocalGuideVendor } from "@/lib/schema";
import {
  Coffee, Wine, UtensilsCrossed, Mountain, ShoppingBag,
  Waves, Bike, Camera, Music, Palette, Heart, Sparkles,
  Globe, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee, Wine, UtensilsCrossed, Mountain, ShoppingBag,
  Waves, Bike, Camera, Music, Palette, Heart, Sparkles,
};

interface StandardCardProps {
  vendor: LocalGuideVendor;
}

export function StandardCard({ vendor }: StandardCardProps) {
  const IconComponent = ICON_MAP[vendor.iconType || "Coffee"] || Coffee;

  return (
    <div className="group relative w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Visual Key: No Border + Soft Shadow (already in classes) */}

      <div className="p-6 pb-20"> {/* pb-20 reserves space for absolute action buttons if needed, or structured differently */}

        {/* Badges Absolute Top Left */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center justify-center px-3 py-1 bg-[#8BABA5] text-white text-xs font-bold rounded-full shadow-sm">
            {vendor.priceLevel || "$"}
          </span>
        </div>

        {/* Center Stack */}
        <div className="flex flex-col items-center text-center mt-6 space-y-3">
          {/* Name: Serif Font #333333 */}
          <h3 className="font-serif text-xl font-bold text-[#333333]">
            {vendor.vendorName}
          </h3>

          {/* Icon: Medium (32px) #556D78 */}
          <div className="p-2">
            <IconComponent className="w-8 h-8 text-[#556D78]" />
          </div>

          {/* Description: Short Vibe Text Sans-serif #555555 */}
          <p className="text-sm text-[#555555] font-sans leading-relaxed max-w-[260px]">
            {vendor.description || "A local favorite."}
          </p>
        </div>
      </div>

      {/* Action Row (Bottom) */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center gap-3">
        {vendor.websiteUrl && (
          <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-1.5 border border-[#556D78] text-[#556D78] text-xs font-medium uppercase tracking-wider rounded transition-colors hover:bg-[#556D78] hover:text-white">
              Website
            </button>
          </a>
        )}
        {vendor.googleMapsUrl && (
          <a href={vendor.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-1.5 border border-[#556D78] text-[#556D78] text-xs font-medium uppercase tracking-wider rounded transition-colors hover:bg-[#556D78] hover:text-white">
              Directions
            </button>
          </a>
        )}
      </div>
    </div>
  );
}
