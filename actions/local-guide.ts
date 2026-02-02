"use server";

import { db } from "@/lib/db";
import { localGuideVendors, type NewLocalGuideVendor } from "@/lib/schema";
import { eq, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============================================
// LOCAL GUIDE VENDOR ACTIONS
// ============================================

export async function createVendor(data: Omit<NewLocalGuideVendor, "id" | "createdAt">) {
  const [vendor] = await db.insert(localGuideVendors).values(data).returning();
  revalidatePath("/admin/local-guide");
  revalidatePath("/local");
  return vendor;
}

export async function updateVendor(id: number, data: Partial<NewLocalGuideVendor>) {
  const [vendor] = await db
    .update(localGuideVendors)
    .set(data)
    .where(eq(localGuideVendors.id, id))
    .returning();
  revalidatePath("/admin/local-guide");
  revalidatePath("/local");
  return vendor;
}

export async function deleteVendor(id: number) {
  await db.delete(localGuideVendors).where(eq(localGuideVendors.id, id));
  revalidatePath("/admin/local-guide");
  revalidatePath("/local");
}

export async function reorderVendors(orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(localGuideVendors).set({ sortOrder: index }).where(eq(localGuideVendors.id, id))
    )
  );
  revalidatePath("/admin/local-guide");
  revalidatePath("/local");
}

// ============================================
// QUERY ACTIONS
// ============================================

export async function getVendors() {
  return await db
    .select()
    .from(localGuideVendors)
    .where(eq(localGuideVendors.isActive, true))
    .orderBy(asc(localGuideVendors.sortOrder));
}

export async function getAllVendors() {
  return await db
    .select()
    .from(localGuideVendors)
    .orderBy(asc(localGuideVendors.sortOrder));
}

export async function getVipVendors() {
  return await db
    .select()
    .from(localGuideVendors)
    .where(
      and(
        eq(localGuideVendors.isActive, true),
        eq(localGuideVendors.isVipSponsor, true)
      )
    )
    .orderBy(asc(localGuideVendors.sortOrder));
}

export async function getVendorsByCategory(category: string) {
  return await db
    .select()
    .from(localGuideVendors)
    .where(
      and(
        eq(localGuideVendors.isActive, true),
        eq(localGuideVendors.category, category)
      )
    )
    .orderBy(asc(localGuideVendors.sortOrder));
}

export async function getVendorById(id: number) {
  const [vendor] = await db
    .select()
    .from(localGuideVendors)
    .where(eq(localGuideVendors.id, id));
  return vendor;
}
