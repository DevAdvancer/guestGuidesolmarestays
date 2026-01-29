import { PartyPopper, Cigarette, Moon } from "lucide-react"

const rules = [
  { icon: PartyPopper, label: "No Parties" },
  { icon: Cigarette, label: "No Smoking" },
  { icon: Moon, label: "Quiet 10pm-8am" },
]

export function HouseRules() {
  return (
    <section className="flex items-center justify-around py-4 px-2 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border/50">
      {rules.map((rule) => (
        <div key={rule.label} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border dark:border-red-400/20 shadow-sm">
            <rule.icon className="w-5 h-5 text-destructive dark:text-red-400" />
          </div>
          <span className="text-xs font-medium text-foreground text-center">{rule.label}</span>
        </div>
      ))}
    </section>
  )
}
