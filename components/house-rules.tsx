import { PartyPopper, Cigarette, Moon, LucideIcon } from "lucide-react"
import { HouseRule } from "@/types/guidebook"
import * as LucideIcons from "lucide-react"

interface HouseRulesProps {
  rules: HouseRule[]
}

export function HouseRules({ rules }: HouseRulesProps) {
  return (
    <section className="flex items-center justify-around py-4 px-2 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border/50">
      {rules.map((rule) => {
        const Icon = (LucideIcons[rule.icon as keyof typeof LucideIcons] || Moon) as LucideIcon

        return (
          <div key={rule.id} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border dark:border-red-400/20 shadow-sm">
              <Icon className="w-5 h-5 text-destructive dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-foreground text-center">{rule.label}</span>
          </div>
        )
      })}
    </section>
  )
}
