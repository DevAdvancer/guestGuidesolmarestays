import { notFound } from "next/navigation"
import { guidebooks } from "@/lib/guidebook-data"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { QuickHitsGrid } from "@/components/quick-hits-grid"
import { HouseRules } from "@/components/house-rules"
import { HouseManual } from "@/components/house-manual"
import { SafetySection } from "@/components/safety-section"
import { FooterCTA } from "@/components/footer-cta"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function GuidebookPage({ params }: PageProps) {
  const { slug } = await params
  const guidebook = guidebooks[slug]

  if (!guidebook) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header contactPhone={guidebook.host.phone} />
      <HeroSection
        title={guidebook.title}
        subtitle={guidebook.subtitle}
        heroImage={guidebook.heroImage}
      />
      <div className="px-4 pt-6 pb-20 space-y-8 max-w-2xl mx-auto">
        <QuickHitsGrid
          wifi={guidebook.wifi}
          doorCode={guidebook.doorCode}
          address={guidebook.address}
          checkOutTime={guidebook.checkOutTime}
        />
        <HouseRules rules={guidebook.houseRules} />
        <HouseManual sections={guidebook.manualSections} />
        <SafetySection items={guidebook.emergencyItems} />
      </div>
      <FooterCTA guideLink={guidebook.localGuideLink} />
    </main>
  )
}

export function generateStaticParams() {
  return Object.keys(guidebooks).map((slug) => ({
    slug,
  }))
}
