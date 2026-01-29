import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { QuickHitsGrid } from "@/components/quick-hits-grid"
import { HouseRules } from "@/components/house-rules"
import { HouseManual } from "@/components/house-manual"
import { SafetySection } from "@/components/safety-section"
import { FooterCTA } from "@/components/footer-cta"

export default function GuestGuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div className="px-4 pt-6 pb-20 space-y-8 max-w-2xl mx-auto">
        <QuickHitsGrid />
        <HouseRules />
        <HouseManual />
        <SafetySection />
      </div>
      <FooterCTA />
    </main>
  )
}
