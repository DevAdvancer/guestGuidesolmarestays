"use client";

import Image from "next/image"
import Link from "next/link"
import { MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocalGuideFooterProps {
  link: string;
}

export function LocalGuideFooter({ link }: LocalGuideFooterProps) {
  return (
    <section className="relative h-64 mt-8">
      <Image
        src="/images/local-lifestyle.jpg?v=3"
        alt="Local dining and activities"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Live Like a Local</h2>
        <p className="text-white/80 mb-4">Discover the best spots in town</p>
        <Button asChild size="lg" className="gap-2 bg-[#556D78] text-white hover:bg-[#556D78]/90 border-none rounded-full shadow-lg">
          <Link href={link}>
            <MapPinned className="w-5 h-5" />
            Explore Dining & Activities
          </Link>
        </Button>
      </div>
    </section>
  );
}
