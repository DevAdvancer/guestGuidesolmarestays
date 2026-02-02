"use client"

import { cn } from "@/lib/utils"
import { ArrowRight, Code2, Copy, Rocket, Zap, LucideIcon } from "lucide-react"
import { useState } from "react"

export interface CardFlipProps {
  title?: string
  subtitle?: string
  description?: string
  features?: string[]
  color?: string
  icon?: LucideIcon
  onAction?: () => void
  actionLabel?: string
  frontContent?: React.ReactNode
  backContent?: React.ReactNode
}

export default function CardFlip({
  title = "Build MVPs Fast",
  subtitle = "Launch your idea in record time",
  description,
  features = [],
  color = "#ff2e88",
  icon: Icon = Rocket,
  onAction,
  actionLabel = "Start Building",
  frontContent,
  backContent,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Default Front Content (Centered layout with title on top)
  const DefaultFrontAnimation = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
      <h3 className="text-xl font-bold tracking-tight text-[#556D78] mb-4 text-center">
        {title}
      </h3>
      <div className="flex items-center justify-center rounded-2xl bg-blue-50 p-5 shadow-sm">
        <Icon className="h-10 w-10" style={{ color }} />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-500 text-center">
        {subtitle}
      </p>
    </div>
  )

  return (
    <div
      style={{
        ["--primary" as any]: color,
      }}
      className="group relative h-[300px] w-full [perspective:2000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(0deg)] [backface-visibility:hidden]",
            "overflow-hidden rounded-2xl",
            "bg-white",
            "dark:bg-zinc-900",
            "border border-slate-100 dark:border-zinc-800",
            "shadow-sm dark:shadow-xl",
            "transition-all duration-700",
            "group-hover:shadow-md dark:group-hover:shadow-2xl",
            "group-hover:border-slate-200 dark:group-hover:border-zinc-700",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          {frontContent || <DefaultFrontAnimation />}
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "rounded-2xl p-6",
            "bg-white",
            "dark:bg-zinc-900",
            "border border-slate-100 dark:border-zinc-800",
            "shadow-sm dark:shadow-xl",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-md dark:group-hover:shadow-2xl",
            "group-hover:border-slate-200 dark:group-hover:border-zinc-700",
            !isFlipped ? "opacity-0" : "opacity-100"
          )}
        >

          <div className="relative z-10 flex-1 space-y-5 flex flex-col justify-center items-center text-center">
            <div className="space-y-2 w-full">
              <div className="flex flex-col items-center justify-center gap-4">
                <h3 className="text-xl leading-snug font-serif font-medium tracking-tight text-center text-zinc-900 transition-all duration-500 group-hover:translate-y-[-2px] dark:text-white">
                  {title}
                </h3>
              </div>
            </div>
            {description && (
              <p className="line-clamp-4 text-sm text-zinc-500 transition-all duration-500 group-hover:translate-y-[-2px] dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>

          {backContent}

          {features.length > 0 && (
            <div className="space-y-2.5">
              {features.map((feature, index) => {
                const icons = [Copy, Code2, Rocket, Zap]
                const IconComponent = icons[index % icons.length]
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300"
                    style={{
                      transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md">
                      <IconComponent className="text-primary h-3 w-3" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="relative z-10 mt-auto pt-4">
            <div
              onClick={(e) => {
                e.stopPropagation()
                onAction?.()
              }}
              className={cn(
                "group/start relative",
                "flex items-center justify-between",
                "rounded-lg p-3",
                "transition-all duration-300",
                "bg-slate-50",
                "dark:bg-zinc-800",
                "hover:bg-slate-100",
                "dark:hover:bg-zinc-700",
                "hover:scale-[1.02] hover:cursor-pointer",
              )}
            >
              <span className="text-sm font-medium text-zinc-900 transition-colors duration-300 dark:text-white">
                {actionLabel}
              </span>
              <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1" style={{ color }} />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          0% { transform: translateX(-100px); opacity: 0; }
          50% { transform: translateX(0); opacity: 0.8; }
          100% { transform: translateX(100px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
