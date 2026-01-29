import { Phone, Hospital, Shield, Flame } from "lucide-react"

const emergencyItems = [
  {
    icon: Phone,
    title: "Emergency Services",
    description: "Police, Fire, Medical",
    action: "tel:911",
    actionLabel: "Dial 911",
    urgent: true,
  },
  {
    icon: Shield,
    title: "Property Management",
    description: "For urgent property issues",
    action: "tel:+18052426411",
    actionLabel: "(805) 242-6411",
  },
  {
    icon: Hospital,
    title: "Nearest Hospital",
    description: "French Hospital Medical Center, 1911 Johnson Ave, San Luis Obispo",
    action: "https://www.google.com/maps/search/?api=1&query=French+Hospital+Medical+Center+1911+Johnson+Ave+San+Luis+Obispo+CA",
    actionLabel: "Get Directions",
  },
  {
    icon: Phone,
    title: "Non-Emergency Police",
    description: "SLO Sheriff",
    action: "tel:+18057817312",
    actionLabel: "(805) 781-7312",
  },
  {
    icon: Flame,
    title: "Fire Extinguisher",
    description: "Kitchen (Under Sink)",
    actionLabel: null,
  },
]

export function SafetySection() {
  return (
    <section className="bg-red-50 dark:bg-destructive/10 rounded-xl p-4 border border-red-100 dark:border-destructive/20">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-destructive" />
        Safety & Emergency
      </h2>
      <div className="space-y-3">
        {emergencyItems.map((item) => (
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
              <item.icon
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
        ))}
      </div>
    </section>
  )
}
