import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { properties, houseRules, manualSections, manualItems, emergencyItems } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { PropertyEditClient } from "../components/property-edit-client";

interface PropertyEditPageProps {
  params: Promise<{ id: string }>;
}

async function getPropertyWithRelations(id: string) {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id));

  if (!property) return null;

  const rules = await db
    .select()
    .from(houseRules)
    .where(eq(houseRules.propertyId, id))
    .orderBy(asc(houseRules.sortOrder));

  const sections = await db
    .select()
    .from(manualSections)
    .where(eq(manualSections.propertyId, id))
    .orderBy(asc(manualSections.sortOrder));

  const sectionIds = sections.map((s) => s.id);
  const items = sectionIds.length > 0
    ? await db
      .select()
      .from(manualItems)
      .orderBy(asc(manualItems.sortOrder))
    : [];

  const emergency = await db
    .select()
    .from(emergencyItems)
    .where(eq(emergencyItems.propertyId, id))
    .orderBy(asc(emergencyItems.sortOrder));

  return {
    property,
    rules,
    sections: sections.map((section) => ({
      ...section,
      items: items.filter((item) => item.sectionId === section.id),
    })),
    emergency,
  };
}

export default async function PropertyEditPage({ params }: PropertyEditPageProps) {
  const { id } = await params;
  const data = await getPropertyWithRelations(id);

  if (!data) {
    notFound();
  }

  return (
    <PropertyEditClient initialData={data} />
  );
}
