"use server";

import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { createGuestToken } from "@/lib/guest-auth";

export async function verifyPropertyPin(formData: FormData) {
  const pin = formData.get("pin") as string;
  const propertyId = formData.get("propertyId") as string;

  if (!pin) {
    return { error: "Please enter a PIN." };
  }

  if (!propertyId) {
    return { error: "Property ID is missing." };
  }

  // Look up property by ID and PIN
  const [property] = await db
    .select({ id: properties.id })
    .from(properties)
    .where(and(eq(properties.id, propertyId), eq(properties.pin, pin)));

  if (property) {
    // Create a signed token
    const token = await createGuestToken(property.id);
    return { success: true, token };
  }

  return {
    error: "Incorrect PIN. Please contact Solmare Stays for assistance.",
  };
}
