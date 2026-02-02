"use client";

import { Phone } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  heroImage?: string | null;
  hostPhone?: string | null;
}

export function HeroSection({ title, subtitle, heroImage, hostPhone }: HeroSectionProps) {
  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  return (
    <section className="relative h-[60vh] min-h-[500px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage || defaultImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>  

      {/* Floating Content Box */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[90%] max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome to {title}
          </h1>
          <p className="text-gray-500 mb-4">{subtitle}</p>

          {hostPhone && (
            <a
              href={`tel:${hostPhone}`}
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Management</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
