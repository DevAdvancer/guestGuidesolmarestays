"use client"

import { Wifi, KeyRound, MapPin, Clock } from "lucide-react"
import { useState } from "react"
import CardFlip from "@/components/ui/flip-card"

interface QuickHitsProps {
  wifi: {
    network: string
    password: string
  }
  doorCode: string
  address: string
  checkOutTime: string
}

export function QuickHitsGrid({ wifi, doorCode, address, checkOutTime }: QuickHitsProps) {
  const [copiedWifi, setCopiedWifi] = useState(false)
  const [copiedDoor, setCopiedDoor] = useState(false)

  const handleCopy = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(address)
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    if (isIOS) {
      window.location.href = `http://maps.apple.com/?q=${encodedAddress}`
    } else {
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    }
  }

  const handleCheckout = () => {
    window.location.hash = "departure-section"
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* WiFi Card */}
        <div className="flex justify-center">
          <CardFlip
            title="WiFi Access"
            subtitle={wifi.network}
            description={`Password: ${wifi.password}`}
            color="#556D78"
            icon={Wifi}
            actionLabel={copiedWifi ? "Copied!" : "Tap to copy"}
            onAction={() => handleCopy(wifi.password, setCopiedWifi)}
          />
        </div>

        {/* Door Code Card */}
        <div className="flex justify-center">
          <CardFlip
            title="Door Code"
            subtitle="Access PIN"
            description={`Your code: ${doorCode}`}
            color="#556D78"
            icon={KeyRound}
            actionLabel={copiedDoor ? "Copied!" : "Tap to copy"}
            onAction={() => handleCopy(doorCode, setCopiedDoor)}
          />
        </div>

        {/* Location Card */}
        <div className="flex justify-center">
          <CardFlip
            title="Location"
            subtitle="Property Address"
            description={address}
            color="#556D78"
            icon={MapPin}
            actionLabel="Get Directions"
            onAction={handleDirections}
          />
        </div>

        {/* Checkout Card */}
        <div className="flex justify-center">
          <CardFlip
            title="Check-Out"
            subtitle={checkOutTime}
            description="View departure checklist and instructions."
            color="#556D78"
            icon={Clock}
            actionLabel="View Instructions"
            onAction={handleCheckout}
          />
        </div>
      </div>
    </section>
  )
}
