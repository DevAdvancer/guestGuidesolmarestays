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

// ============================================
// BULK SAVE ACTIONS
// ============================================

export interface CompletePropertyData {
  property: Partial<NewProperty>;
  manual: (NewManualSection & { id?: number; items: (NewManualItem & { id?: number })[] })[];
  rules: (NewHouseRule & { id?: number })[];
  emergency: (NewEmergencyItem & { id?: number })[];
}

export async function savePropertyComplete(propertyId: string, data: CompletePropertyData) {
  try {
    // 1. Update Property
    await db
      .update(properties)
      .set({ ...data.property, updatedAt: new Date() })
      .where(eq(properties.id, propertyId));

    // 2. Process Manual Sections
    const existingSections = await db.select().from(manualSections).where(eq(manualSections.propertyId, propertyId));
    const existingSectionIds = existingSections.map((s) => s.id);
    const incomingSectionIds = data.manual.filter((s) => s.id && s.id > 0).map((s) => s.id as number);
    const sectionsToDelete = existingSectionIds.filter((id) => !incomingSectionIds.includes(id));

    if (sectionsToDelete.length > 0) {
      for (const sectionId of sectionsToDelete) {
        await db.delete(manualSections).where(eq(manualSections.id, sectionId));
      }
    }

    for (let i = 0; i < data.manual.length; i++) {
      const sectionData = data.manual[i];
      let sectionId = sectionData.id;

      if (sectionId && sectionId > 0) {
        await db
          .update(manualSections)
          .set({
            title: sectionData.title,
            subtitle: sectionData.subtitle,
            icon: sectionData.icon,
            checklist: sectionData.checklist,
            sortOrder: i,
          })
          .where(eq(manualSections.id, sectionId));
      } else {
        const [newSection] = await db
          .insert(manualSections)
          .values({
            propertyId,
            title: sectionData.title,
            subtitle: sectionData.subtitle,
            icon: sectionData.icon,
            checklist: sectionData.checklist,
            sortOrder: i,
          })
          .returning();
        sectionId = newSection.id;
      }

      // Process Items for this section
      const items = sectionData.items || [];
      if (sectionData.id && sectionData.id > 0) {
        const existingItems = await db.select().from(manualItems).where(eq(manualItems.sectionId, sectionId));
        const existingItemIds = existingItems.map(item => item.id);
        const incomingItemIds = items.filter(item => item.id && item.id > 0).map(item => item.id as number);
        const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));

        if (itemsToDelete.length > 0) {
          for (const itemId of itemsToDelete) {
            await db.delete(manualItems).where(eq(manualItems.id, itemId));
          }
        }
      }

      for (let j = 0; j < items.length; j++) {
        const itemData = items[j];
        if (itemData.id && itemData.id > 0) {
          await db.update(manualItems).set({
            label: itemData.label,
            value: itemData.value,
            icon: itemData.icon,
            bullets: itemData.bullets,
            highlight: itemData.highlight,
            sortOrder: j,
            sectionId: sectionId
          }).where(eq(manualItems.id, itemData.id));
        } else {
          await db.insert(manualItems).values({
            sectionId: sectionId,
            label: itemData.label,
            value: itemData.value,
            icon: itemData.icon,
            bullets: itemData.bullets,
            highlight: itemData.highlight,
            sortOrder: j,
          });
        }
      }
    }

    // 3. Process House Rules
    const existingRules = await db.select().from(houseRules).where(eq(houseRules.propertyId, propertyId));
    const existingRuleIds = existingRules.map(r => r.id);
    const incomingRuleIds = data.rules.filter(r => r.id && r.id > 0).map(r => r.id as number);
    const rulesToDelete = existingRuleIds.filter(id => !incomingRuleIds.includes(id));

    if (rulesToDelete.length > 0) {
      for (const id of rulesToDelete) {
        await db.delete(houseRules).where(eq(houseRules.id, id));
      }
    }

    for (let i = 0; i < data.rules.length; i++) {
      const rule = data.rules[i];
      if (rule.id && rule.id > 0) {
        await db.update(houseRules).set({
          label: rule.label,
          icon: rule.icon,
          sortOrder: i
        }).where(eq(houseRules.id, rule.id));
      } else {
        await db.insert(houseRules).values({
          propertyId,
          label: rule.label,
          icon: rule.icon,
          sortOrder: i
        });
      }
    }

    // 4. Process Emergency Items
    const existingEmergency = await db.select().from(emergencyItems).where(eq(emergencyItems.propertyId, propertyId));
    const existingEmergencyIds = existingEmergency.map(r => r.id);
    const incomingEmergencyIds = data.emergency.filter(r => r.id && r.id > 0).map(r => r.id as number);
    const emergencyToDelete = existingEmergencyIds.filter(id => !incomingEmergencyIds.includes(id));

    if (emergencyToDelete.length > 0) {
      for (const id of emergencyToDelete) {
        await db.delete(emergencyItems).where(eq(emergencyItems.id, id));
      }
    }

    for (let i = 0; i < data.emergency.length; i++) {
      const item = data.emergency[i];
      if (item.id && item.id > 0) {
        await db.update(emergencyItems).set({
          title: item.title,
          description: item.description,
          icon: item.icon,
          actionLabel: item.actionLabel,
          action: item.action,
          link: item.link,
          address: item.address,
          urgent: item.urgent,
          sortOrder: i
        }).where(eq(emergencyItems.id, item.id));
      } else {
        await db.insert(emergencyItems).values({
          propertyId,
          title: item.title,
          description: item.description,
          icon: item.icon,
          actionLabel: item.actionLabel,
          action: item.action,
          link: item.link,
          address: item.address,
          urgent: item.urgent,
          sortOrder: i
        });
      }
    }

    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to save property complete:", error);
    throw error;
  }
}

// ============================================
// DUPLICATE ACTION
// ============================================

export async function duplicateProperty(propertyId: string) {
  try {
    // 1. Get source property
    const [sourceProperty] = await db.select().from(properties).where(eq(properties.id, propertyId));
    if (!sourceProperty) throw new Error("Property not found");

    // 2. Create new property
    const [newProperty] = await db.insert(properties).values({
      title: `Copy of ${sourceProperty.title}`,
      subtitle: sourceProperty.subtitle,
      // description: sourceProperty.description, // Not in schema
      address: sourceProperty.address,
      heroImage: sourceProperty.heroImage,
      addressLink: sourceProperty.addressLink,
      hostName: sourceProperty.hostName,
      hostPhone: sourceProperty.hostPhone,
      hostEmail: sourceProperty.hostEmail,
      // hostAvatar: sourceProperty.hostAvatar, // Not in schema
      wifiNetwork: sourceProperty.wifiNetwork,
      wifiPassword: sourceProperty.wifiPassword,
      doorCode: sourceProperty.doorCode,
      // checkInTime: sourceProperty.checkInTime, // Not in schema
      checkOutTime: sourceProperty.checkOutTime,
      localGuideLink: sourceProperty.localGuideLink,
      pin: Math.floor(1000 + Math.random() * 9000).toString(), // Generate new 4-digit PIN
      isActive: false, // Default to inactive
    }).returning();

    // 3. Copy House Rules
    const sourceRules = await db.select().from(houseRules).where(eq(houseRules.propertyId, propertyId));
    if (sourceRules.length > 0) {
      await db.insert(houseRules).values(
        sourceRules.map(rule => ({
          propertyId: newProperty.id,
          label: rule.label,
          icon: rule.icon,
          sortOrder: rule.sortOrder,
        }))
      );
    }

    // 4. Copy Emergency Items
    const sourceEmergency = await db.select().from(emergencyItems).where(eq(emergencyItems.propertyId, propertyId));
    if (sourceEmergency.length > 0) {
      await db.insert(emergencyItems).values(
        sourceEmergency.map(item => ({
          propertyId: newProperty.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          actionLabel: item.actionLabel,
          action: item.action,
          link: item.link,
          address: item.address,
          urgent: item.urgent,
          sortOrder: item.sortOrder,
        }))
      );
    }

    // 5. Copy Manual Sections and Items
    const sourceSections = await db.select().from(manualSections).where(eq(manualSections.propertyId, propertyId));

    // We need to do this sequentially to keep item relationships
    for (const section of sourceSections) {
      const [newSection] = await db.insert(manualSections).values({
        propertyId: newProperty.id,
        title: section.title,
        subtitle: section.subtitle,
        icon: section.icon,
        checklist: section.checklist,
        sortOrder: section.sortOrder,
      }).returning();

      const sourceItems = await db.select().from(manualItems).where(eq(manualItems.sectionId, section.id));
      if (sourceItems.length > 0) {
        await db.insert(manualItems).values(
          sourceItems.map(item => ({
            sectionId: newSection.id,
            label: item.label,
            value: item.value,
            icon: item.icon,
            bullets: item.bullets,
            highlight: item.highlight,
            sortOrder: item.sortOrder,
          }))
        );
      }
    }

    revalidatePath("/admin/properties");
    return { success: true, newPropertyId: newProperty.id };

  } catch (error) {
    console.error("Failed to duplicate property:", error);
    throw error;
  }
}
