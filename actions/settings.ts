"use server";

import { db } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const allSettings = await db.select().from(settings);
  // Convert array of key-value pairs to a single object
  return allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>);
}

export async function updateSetting(key: string, value: any) {
  try {
    // Check if setting exists
    const [existing] = await db.select().from(settings).where(eq(settings.key, key));

    if (existing) {
      await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/"); // In case settings affect public pages
    return { success: true };
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error);
    throw new Error("Failed to update setting");
  }
}
