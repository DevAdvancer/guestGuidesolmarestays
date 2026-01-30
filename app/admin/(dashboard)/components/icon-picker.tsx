"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Comprehensive icons for vacation rentals and daily life
const ICON_CATEGORIES = {
  "House Rules": [
    "Cigarette", "PartyPopper", "Volume2", "Dog", "Cat", "Users", "Clock", "Trash2", "Car",
    "Baby", "Flame", "Wine", "Music", "Camera", "Footprints", "ShoppingBag", "Glasses",
  ],
  "Home & Appliances": [
    "Home", "Tv", "Wifi", "Fan", "Snowflake", "Thermometer", "Droplets", "Plug", "Power",
    "Microwave", "Coffee", "UtensilsCrossed", "Bath", "Bed", "Lamp", "Sofa", "Speaker",
    "ShowerHead", "WashingMachine", "Refrigerator", "AirVent", "Heater", "Lightbulb",
    "Monitor", "Laptop", "Printer", "Router", "Cable", "BatteryCharging",
  ],
  "Kitchen & Dining": [
    "ChefHat", "Utensils", "CookingPot", "Soup", "Pizza", "Salad", "Sandwich", "Croissant",
    "IceCream", "Cake", "Cookie", "Apple", "Carrot", "Egg", "Fish", "Beef",
    "GlassWater", "CupSoda", "Beer", "Martini", "Milk",
  ],
  "Outdoor & Recreation": [
    "Trees", "Mountain", "Sun", "Cloud", "CloudRain", "Umbrella", "Waves", "Anchor",
    "Bike", "Tent", "Flame", "Grill", "Flower", "Leaf", "Sprout", "TreePine",
    "Palmtree", "Sailboat", "Fish",
  ],
  "Transportation & Parking": [
    "Car", "CarFront", "ParkingCircle", "ParkingSquare", "Fuel", "Gauge", "CircleParking",
    "Bus", "Train", "Plane", "Bike", "Footprints", "Navigation", "Route", "MapPin",
  ],
  "Safety & Emergency": [
    "Phone", "PhoneCall", "AlertTriangle", "Siren", "Cross", "Stethoscope", "Pill", "Activity",
    "FireExtinguisher", "BadgeAlert", "ShieldAlert", "Bell", "BellRing", "Ambulance",
    "Hospital", "HeartPulse", "Thermometer", "Bandage", "Scissors",
  ],
  "Bathroom & Cleaning": [
    "Bath", "ShowerHead", "Droplets", "Sparkles", "SprayCan", "Trash2", "Recycle",
    "Shirt", "Hanger", "Iron",
  ],
  "Time & Schedule": [
    "Clock", "Timer", "Alarm", "AlarmClock", "Calendar", "CalendarDays", "CalendarCheck",
    "Hourglass", "Watch", "Sunrise", "Sunset", "Moon", "Sun",
  ],
  "Communication": [
    "Phone", "Mail", "MessageCircle", "MessageSquare", "Send", "Inbox", "AtSign",
    "Globe", "Link", "Share", "QrCode", "Smartphone",
  ],
  "General & Actions": [
    "AlertCircle", "Info", "HelpCircle", "CheckCircle", "XCircle", "Star", "Heart",
    "ThumbsUp", "ThumbsDown", "Eye", "EyeOff", "Search", "ZoomIn", "ZoomOut",
    "Plus", "Minus", "X", "Check", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown",
    "RefreshCw", "RotateCw", "Download", "Upload", "Save", "Edit", "Pencil",
    "Copy", "Clipboard", "FileText", "Folder", "Archive", "Bookmark", "Tag",
  ],
  "Access & Security": [
    "Key", "Lock", "Unlock", "DoorOpen", "DoorClosed", "LogIn", "LogOut",
    "Shield", "ShieldCheck", "Fingerprint", "Scan", "KeyRound",
  ],
  "Entertainment": [
    "Gamepad", "Headphones", "Music", "Radio", "PlayCircle", "PauseCircle", "StopCircle",
    "SkipForward", "SkipBack", "Volume2", "VolumeX", "Mic", "Video", "Camera",
    "Image", "Film", "Clapperboard", "BookOpen", "Book", "Newspaper",
  ],
  "Weather": [
    "Sun", "Moon", "Cloud", "CloudRain", "CloudSnow", "CloudLightning", "Wind",
    "Umbrella", "Thermometer", "Droplets", "Snowflake", "Rainbow",
  ],
} as const;

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const CurrentIcon = (Icons as any)[value] || Icons.HelpCircle;

  const allIcons = Object.entries(ICON_CATEGORIES).flatMap(([category, icons]) =>
    icons.map(icon => ({ icon, category }))
  );

  // Remove duplicates
  const uniqueIcons = allIcons.filter((item, index, self) =>
    index === self.findIndex((t) => t.icon === item.icon)
  );

  const filteredIcons = search
    ? uniqueIcons.filter(({ icon }) => icon.toLowerCase().includes(search.toLowerCase()))
    : uniqueIcons;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-3 bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100",
            className
          )}
        >
          <CurrentIcon className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
          <span className="flex-1 text-left truncate">{value || "Select icon..."}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {search ? (
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map(({ icon }) => {
                const IconComponent = (Icons as any)[icon];
                if (!IconComponent) return null;
                return (
                  <button
                    key={icon}
                    onClick={() => {
                      onChange(icon);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center",
                      value === icon && "bg-blue-100 ring-2 ring-blue-500"
                    )}
                    title={icon}
                  >
                    <IconComponent className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          ) : (
            Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
              <div key={category} className="mb-3">
                <p className="text-xs font-medium text-gray-500 px-2 mb-2">{category}</p>
                <div className="grid grid-cols-6 gap-1">
                  {icons.map((icon) => {
                    const IconComponent = (Icons as any)[icon];
                    if (!IconComponent) return null;
                    return (
                      <button
                        key={icon}
                        onClick={() => {
                          onChange(icon);
                          setOpen(false);
                        }}
                        className={cn(
                          "p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center",
                          value === icon && "bg-blue-100 ring-2 ring-blue-500"
                        )}
                        title={icon}
                      >
                        <IconComponent className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          {search && filteredIcons.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No icons found</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
