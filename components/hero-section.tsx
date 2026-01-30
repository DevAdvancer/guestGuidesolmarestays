import Image from "next/image"

interface HeroSectionProps {
  title: string
  subtitle: string
  heroImage: string
}

export function HeroSection({ title, subtitle, heroImage }: HeroSectionProps) {
  return (
    <section className="relative h-64 sm:h-80">
      <Image
        src={heroImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-balance">
          {title}
        </h1>
        <p className="text-white/90 mt-2 text-lg">{subtitle}</p>
      </div>
    </section>
  )
}
