"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Wifi, KeyRound, MapPin, Clock, Check, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const WIFI_NETWORK = "California"
const WIFI_PASSWORD = "Rudi2024!"
const DOOR_CODE = "1512"
const ADDRESS = "155 San Antonia Ave, Avila Beach"

function CopyableCard({
  icon: Icon,
  title,
  subtitle,
  copyValue,
  largeSubtitle = false,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  copyValue: string
  largeSubtitle?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyValue)
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98] border-border"
      onClick={handleCopy}
    >
      <CardContent className="p-4 flex flex-col items-center text-center min-h-[120px] justify-center relative">
        {copied && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" />
            Copied!
          </div>
        )}
        <Icon className="w-8 h-8 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`font-semibold text-foreground ${largeSubtitle ? "text-2xl" : "text-base"}`}>
          {subtitle}
        </p>
        {!copied && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Copy className="w-3 h-3" />
            Tap to copy
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LocationCard() {
  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(ADDRESS)
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    
    if (isIOS) {
      window.location.href = `http://maps.apple.com/?q=${encodedAddress}`
    } else {
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    }
  }

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98] border-border"
      onClick={handleDirections}
    >
      <CardContent className="p-4 flex flex-col items-center text-center min-h-[120px] justify-center">
        <MapPin className="w-8 h-8 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Location</p>
        <p className="font-semibold text-foreground text-sm leading-tight">{ADDRESS}</p>
        <p className="text-xs text-primary mt-2">Get Directions →</p>
      </CardContent>
    </Card>
  )
}

function CheckoutCard() {
  const handleClick = () => {
    window.location.hash = "departure-section"
  }

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98] border-border"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex flex-col items-center text-center min-h-[120px] justify-center">
        <Clock className="w-8 h-8 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Check-Out</p>
        <p className="font-semibold text-2xl text-foreground">11:00 AM</p>
        <p className="text-xs text-primary mt-2">View Instructions →</p>
      </CardContent>
    </Card>
  )
}

export function QuickHitsGrid() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-3">
        <CopyableCard
          icon={Wifi}
          title={`WiFi: ${WIFI_NETWORK}`}
          subtitle={WIFI_PASSWORD}
          copyValue={WIFI_PASSWORD}
        />
        <CopyableCard
          icon={KeyRound}
          title="Door Code"
          subtitle={DOOR_CODE}
          copyValue={DOOR_CODE}
          largeSubtitle
        />
        <LocationCard />
        <CheckoutCard />
      </div>
    </section>
  )
}
