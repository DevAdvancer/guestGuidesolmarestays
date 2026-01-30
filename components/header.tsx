"use client"

import Image from "next/image"
import { useState } from "react"
import { LifeBuoy, Phone } from "lucide-react"
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

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                alt="Solmaré Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-lg text-gray-900">Solmaré Stays</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setHelpOpen(true)}
              className="px-5 py-2.5 h-10 text-base bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LifeBuoy className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Help
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Need Assistance?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-600 text-base">
              For general questions, please contact your host on the platform you booked on (Airbnb/VRBO).
            </p>
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 w-full py-4 px-5 bg-blue-600 text-white font-medium text-base rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              Call Management {contactPhone === "+18052426411" ? "(805) 242-6411" : contactPhone}
            </a>
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="w-full h-11 text-base bg-transparent">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}
