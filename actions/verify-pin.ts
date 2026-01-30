"use server"

import { PIN_MAPPING } from "@/lib/guidebook-data"


export async function verifyPin(formData: FormData) {
  const pin = formData.get("pin") as string
  const slug = PIN_MAPPING[pin]

  if (slug) {
    return { success: true, slug }
  }

  return {
    error: "Invalid PIN. Please try again.",
  }
}
