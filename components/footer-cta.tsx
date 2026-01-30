import Image from "next/image"
import Link from "next/link"
import { MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FooterCTAProps {
  guideLink?: string
}

export function FooterCTA({ guideLink }: FooterCTAProps) {
  if (!guideLink) return null;

  return (
    <section className="relative h-64 mt-8">
      <Image
        src="/images/local-lifestyle.jpg"
        alt="Local dining and activities"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Live Like a Local</h2>
        <p className="text-white/80 mb-4">Discover the best spots in town</p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/local-guide">
            <MapPinned className="w-5 h-5" />
            Explore Dining & Activities
          </Link>
        </Button>
      </div>
    </section>
  )
}
