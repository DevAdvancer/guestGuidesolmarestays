import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  // ... (keep metadata same)
  generator: 'v0.app'
}

import { initializeSystem } from "@/lib/auth-init";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Ensure critical system settings and admin user exist on startup
  await initializeSystem();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-serif antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
