import FlipCardGrid from "@/components/flip-card-grid"
import { Header } from "@/components/header"

export default function CardsPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container mx-auto pt-10 space-y-8">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl font-bold tracking-tight">Component Showcase</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Demonstrating our new interactive Flip Cards with colorful, responsive design.
          </p>
        </div>
        <FlipCardGrid />
      </div>
    </main>
  )
}
