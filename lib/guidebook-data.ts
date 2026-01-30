import { guidebook as hummingbirdHouse } from "@/data/hummingbird-house"
import { guidebook as seasideVilla } from "@/data/seaside-villa"
import { GuidebookConfig } from "@/types/guidebook"

const allProperties: GuidebookConfig[] = [
  hummingbirdHouse,
  seasideVilla,
]

export const guidebooks: Record<string, GuidebookConfig> = allProperties.reduce((acc, prop) => {
  acc[prop.id] = prop
  return acc
}, {} as Record<string, GuidebookConfig>)

export const PIN_MAPPING: Record<string, string> = allProperties.reduce((acc, prop) => {
  acc[prop.pin] = prop.id
  return acc
}, {} as Record<string, string>)
