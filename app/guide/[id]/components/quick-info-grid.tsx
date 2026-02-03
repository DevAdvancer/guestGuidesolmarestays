"use client";

import { useState } from "react";
import { Wifi, Key, MapPin, Clock, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickInfoGridProps {
  wifiNetwork?: string | null;
  wifiPassword?: string | null;
  doorCode?: string | null;
  address: string;
  checkOutTime?: string | null;
}

export function QuickInfoGrid({
  wifiNetwork,
  wifiPassword,
  doorCode,
  address,
  checkOutTime,
}: QuickInfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* WiFi Card */}
      <InfoCard
        icon={Wifi}
        label="WiFi"
        value={wifiNetwork ? `Network: ${wifiNetwork}` : "Not set"}
        secret={wifiPassword}
        secretLabel="Password"
      />

      {/* Door Code Card */}
      <InfoCard
        icon={Key}
        label="Entry Code"
        value={doorCode || "Contact Host"}
        copyable
        large
      />

      {/* Location Card */}
      <LocationCard address={address} />

      {/* Check-Out Card */}
      <InfoCard
        icon={Clock}
        label="Check-Out"
        value={checkOutTime || "11:00 AM"}
        large
      />
    </div>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  secret?: string | null;
  secretLabel?: string;
  copyable?: boolean;
  large?: boolean;
}

function InfoCard({ icon: Icon, label, value, secret, secretLabel, copyable, large }: InfoCardProps) {
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
      <div className="flex items-center gap-2 text-blue-600 mb-3">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-base font-medium text-gray-500">{label}</span>
      </div>

      <div className="flex-1">
        <p className={cn("font-semibold text-gray-900", large ? "text-3xl" : "text-xl")}>
          {value}
        </p>

        {secret && (
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="mt-3 text-base text-blue-600 hover:text-blue-700"
          >
            {showSecret ? (
              <span className="font-mono">{secret}</span>
            ) : (
              <span>{secretLabel}: Tap to reveal</span>
            )}
          </button>
        )}
      </div>

      {copyable && (
        <button
          onClick={() => handleCopy(value)}
          className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" strokeWidth={1.5} />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" strokeWidth={1.5} />
              <span>Tap to copy</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function LocationCard({ address }: { address: string }) {
  const handleDirections = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(address);

    if (isIOS) {
      window.open(`maps://maps.apple.com/?q=${encodedAddress}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
      <div className="flex items-center gap-2 text-blue-600 mb-3">
        <MapPin className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-base font-medium text-gray-500">Location</span>
      </div>

      <p className="text-base text-gray-900 line-clamp-2 flex-1">{address}</p>

      <button
        onClick={handleDirections}
        className="mt-4 flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ExternalLink className="h-5 w-5" strokeWidth={1.5} />
        <span>Get Directions</span>
      </button>
    </div>
  );
}
