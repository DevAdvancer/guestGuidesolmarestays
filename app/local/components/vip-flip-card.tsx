"use client";

import { useState } from "react";
import { LocalGuideVendor } from "@/lib/schema";
import {
  Coffee, Wine, UtensilsCrossed, Mountain, ShoppingBag,
  Waves, Bike, Camera, Music, Palette, Heart, Sparkles,
  Globe, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee, Wine, UtensilsCrossed, Mountain, ShoppingBag,
  Waves, Bike, Camera, Music, Palette, Heart, Sparkles,
};

interface VipFlipCardProps {
  vendor: LocalGuideVendor;
}

export function VipFlipCard({ vendor }: VipFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const IconComponent = ICON_MAP[vendor.iconType || "Coffee"] || Coffee;

  return (
    <div
      className="group relative w-full h-[360px] cursor-pointer perspective-1000 flex-shrink-0"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d shadow-lg rounded-xl",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* FRONT FACE */}
        {/* Visual Key: 2px Solid Border (#8BABA5) + VIP Badge */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-xl border-2 border-[#8BABA5] p-6 flex flex-col items-center">

          {/* Top Left: Price Badge (Pill, #8BABA5 bg, White text) */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#8BABA5] text-white text-xs font-bold rounded-full">
              {vendor.priceLevel || "$$"}
            </span>
          </div>

          {/* Top Right: "SOLMARÉ VIP" (Pill, #556D78 bg, White text) */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-[#556D78] text-white text-xs font-bold rounded-full tracking-wider">
              VIP
            </span>
          </div>

          {/* Center Stack */}
          <div className="mt-12 flex flex-col items-center text-center space-y-4 flex-1 justify-center">
            {/* 1. Name: Large Serif Font (#333333) */}
            <h3 className="font-serif text-2xl font-bold text-[#333333] leading-tight px-2">
              {vendor.vendorName}
            </h3>

            {/* 2. Icon: Large (40px) Line Icon #556D78 */}
            <div className="py-2">
              <IconComponent className="w-10 h-10 text-[#556D78]" />
            </div>

            {/* 3. Description: Short Vibe Text Sans-serif #555555 */}
            <p className="text-sm text-[#555555] font-sans leading-relaxed line-clamp-3">
              {vendor.description || "Exclusive VIP Partner."}
            </p>
          </div>

          {/* Footer: "Tap to reveal offer ↻" (Small, Italic, #8BABA5) */}
          <div className="mt-auto pt-4">
            <p className="text-xs text-[#8BABA5] font-medium italic flex items-center gap-1">
              Tap to reveal offer <span className="text-[10px]">↻</span>
            </p>
          </div>
        </div>

        {/* BACK FACE */}
        {/* Visual Key: Solid #556D78 Background */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#556D78] text-white rounded-xl p-6 flex flex-col items-center justify-center text-center">

          {/* Label: "EXCLUSIVE OFFER" (Small Caps) */}
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-white/80 mb-4">
            Exclusive Offer
          </p>

          {/* The Deal: Large Bold Text */}
          <h4 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            {vendor.vipDealText || "Special Discount"}
          </h4>

          {/* Instruction */}
          <p className="text-sm text-white/90 font-sans mt-2 mb-8">
            Show this screen to redeem.
          </p>

          {/* Links: White text, Underlined */}
          <div className="flex gap-6 mt-auto">
            {vendor.websiteUrl && (
              <a
                href={vendor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
              >
                Website
              </a>
            )}
            {vendor.googleMapsUrl && (
              <a
                href={vendor.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
              >
                Directions
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
