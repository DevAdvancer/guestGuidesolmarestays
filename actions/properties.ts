"use server";

import { db } from "@/lib/db";
import { properties, houseRules, manualSections, manualItems, emergencyItems, type NewProperty, type NewHouseRule, type NewManualSection, type NewManualItem, type NewEmergencyItem } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// PROPERTY ACTIONS
// ============================================

export async function createProperty(data: Omit<NewProperty, "id" | "createdAt" | "updatedAt">) {
  const [property] = await db.insert(properties).values(data).returning();
  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  return property;
}

export async function updateProperty(id: string, data: Partial<NewProperty>) {
  const [property] = await db
    .update(properties)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(properties.id, id))
    .returning();
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  revalidatePath("/admin");
  return property;
}

export async function deleteProperty(id: string) {
  await db.delete(properties).where(eq(properties.id, id));
  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  redirect("/admin/properties");
}

// ============================================
// HOUSE RULES ACTIONS
// ============================================

export async function createHouseRule(data: Omit<NewHouseRule, "id">) {
  const [rule] = await db.insert(houseRules).values(data).returning();
  revalidatePath(`/admin/properties/${data.propertyId}`);
  return rule;
}

export async function updateHouseRule(id: number, data: Partial<NewHouseRule>) {
  const [rule] = await db.update(houseRules).set(data).where(eq(houseRules.id, id)).returning();
  if (rule) {
    revalidatePath(`/admin/properties/${rule.propertyId}`);
  }
  return rule;
}

export async function deleteHouseRule(id: number, propertyId: string) {
  await db.delete(houseRules).where(eq(houseRules.id, id));
  revalidatePath(`/admin/properties/${propertyId}`);
}

// ============================================
// MANUAL SECTIONS ACTIONS
// ============================================

export async function createManualSection(data: Omit<NewManualSection, "id">) {
  const [section] = await db.insert(manualSections).values(data).returning();
  revalidatePath(`/admin/properties/${data.propertyId}`);
  return section;
}

export async function updateManualSection(id: number, data: Partial<NewManualSection>) {
  const [section] = await db.update(manualSections).set(data).where(eq(manualSections.id, id)).returning();
  if (section) {
    revalidatePath(`/admin/properties/${section.propertyId}`);
  }
  return section;
}

export async function deleteManualSection(id: number, propertyId: string) {
  await db.delete(manualSections).where(eq(manualSections.id, id));
  revalidatePath(`/admin/properties/${propertyId}`);
}

// ============================================
// MANUAL ITEMS ACTIONS
// ============================================

export async function createManualItem(data: Omit<NewManualItem, "id">, propertyId: string) {
  const [item] = await db.insert(manualItems).values(data).returning();
  revalidatePath(`/admin/properties/${propertyId}`);
  return item;
}

export async function updateManualItem(id: number, data: Partial<NewManualItem>, propertyId: string) {
  const [item] = await db.update(manualItems).set(data).where(eq(manualItems.id, id)).returning();
  revalidatePath(`/admin/properties/${propertyId}`);
  return item;
}

export async function deleteManualItem(id: number, propertyId: string) {
  await db.delete(manualItems).where(eq(manualItems.id, id));
  revalidatePath(`/admin/properties/${propertyId}`);
}

// ============================================
// EMERGENCY ITEMS ACTIONS
// ============================================

export async function createEmergencyItem(data: Omit<NewEmergencyItem, "id">) {
  const [item] = await db.insert(emergencyItems).values(data).returning();
  revalidatePath(`/admin/properties/${data.propertyId}`);
  return item;
}

export async function updateEmergencyItem(id: number, data: Partial<NewEmergencyItem>) {
  const [item] = await db.update(emergencyItems).set(data).where(eq(emergencyItems.id, id)).returning();
  if (item) {
    revalidatePath(`/admin/properties/${item.propertyId}`);
  }
  return item;
}

export async function deleteEmergencyItem(id: number, propertyId: string) {
  await db.delete(emergencyItems).where(eq(emergencyItems.id, id));
  revalidatePath(`/admin/properties/${propertyId}`);
}

// ============================================
// REORDER ACTIONS
// ============================================

export async function reorderManualSections(propertyId: string, orderedIds: number[]) {
  // Update each section's sortOrder based on position in array
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(manualSections).set({ sortOrder: index }).where(eq(manualSections.id, id))
    )
  );
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function reorderManualItems(propertyId: string, sectionId: number, orderedIds: number[]) {
  // Update each item's sortOrder based on position in array
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(manualItems).set({ sortOrder: index }).where(eq(manualItems.id, id))
    )
  );
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function reorderHouseRules(propertyId: string, orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(houseRules).set({ sortOrder: index }).where(eq(houseRules.id, id))
    )
  );
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function reorderEmergencyItems(propertyId: string, orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(emergencyItems).set({ sortOrder: index }).where(eq(emergencyItems.id, id))
    )
  );
  revalidatePath(`/admin/properties/${propertyId}`);
}
