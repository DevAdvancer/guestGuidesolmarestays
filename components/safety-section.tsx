import { Shield, LucideIcon } from "lucide-react"
import { EmergencyItem } from "@/types/guidebook"
import * as LucideIcons from "lucide-react"

interface SafetySectionProps {
  items: EmergencyItem[]
}

export function SafetySection({ items }: SafetySectionProps) {
  return (
    <section className="bg-red-50 dark:bg-destructive/10 rounded-xl p-4 border border-red-100 dark:border-destructive/20">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-destructive" />
        Safety & Emergency
      </h2>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = (LucideIcons[item.icon as keyof typeof LucideIcons] || Shield) as LucideIcon

          return (
            <div
              key={item.title}
              className={`flex items-start gap-3 p-3 rounded-lg border border-transparent ${item.urgent
                ? "bg-red-100 dark:bg-destructive/20 dark:border-destructive/20"
                : "bg-white dark:bg-card dark:border-border/50"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.urgent
                  ? "bg-destructive text-white"
                  : "bg-red-100 dark:bg-destructive/20"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${item.urgent ? "text-currentColor" : "text-destructive"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.actionLabel && item.action && (
                  <a
                    href={item.action}
                    className={`text-sm font-medium mt-1 inline-block ${item.urgent
                      ? "text-destructive dark:text-red-400 hover:underline"
                      : "text-primary hover:underline"
                      }`}
                  >
                    {item.actionLabel}
                  </a>
                )}
                {item.actionLabel && !item.action && (
                  <p className="text-sm font-medium text-primary mt-1">{item.actionLabel}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
