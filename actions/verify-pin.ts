"use server"

import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function verifyPin(formData: FormData) {
  const pin = formData.get("pin") as string;

  if (!pin) {
    return { error: "Please enter a PIN." };
  }

  // Look up property by PIN in the database
  const [property] = await db
    .select({ id: properties.id })
    .from(properties)
    .where(eq(properties.pin, pin));

  if (property) {
    return { success: true, slug: property.id };
  }

  return {
    error: "Invalid PIN. Please try again.",
  };
}
