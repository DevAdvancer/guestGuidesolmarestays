"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface HeroHelpButtonProps {
  contactPhone?: string
}

export function HeroHelpButton({ contactPhone = "+18052426411" }: HeroHelpButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="bg-white border-black text-black hover:bg-gray-50 hover:text-black font-medium text-lg px-10 py-3 h-auto rounded-full transition-all border"
      >
        Help
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
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
