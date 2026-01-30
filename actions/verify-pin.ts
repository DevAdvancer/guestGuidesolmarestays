"use server"

import { PIN_MAPPING } from "@/lib/guidebook-data"
import { redirect } from "next/navigation"

export async function verifyPin(formData: FormData) {
  const pin = formData.get("pin") as string
  const slug = PIN_MAPPING[pin]

  if (slug) {
    redirect(`/guidebook/${slug}`)
  }

  return {
    error: "Invalid PIN. Please try again.",
  }
}
