"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { LifeBuoy, Phone } from "lucide-react"
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface HeaderProps {
  contactPhone?: string
}

export function Header({ contactPhone = "+18052426411" }: HeaderProps) {
  const [helpOpen, setHelpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                alt="Solmaré Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-foreground">Solmaré</span>
          </div>
          <div className="flex items-center gap-2">
            {mounted && <CinematicThemeSwitcher />}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHelpOpen(true)}
              className="gap-2"
            >
              <LifeBuoy className="w-4 h-4" />
              Help
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Need Assistance?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              For general questions, please contact your host on the platform you booked on (Airbnb/VRBO).
            </p>
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-destructive text-white font-medium rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Management {contactPhone === "+18052426411" ? "(805) 242-6411" : contactPhone}
            </a>
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}
