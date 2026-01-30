import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { properties, houseRules, manualSections, manualItems, emergencyItems } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { PropertyForm } from "../property-form";
import { RulesEditor } from "../rules-editor";
import { ManualEditor } from "../manual-editor";
import { EmergencyEditor } from "../emergency-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, BookOpen, AlertTriangle } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{data.property.title}</h1>
        <p className="text-gray-500 mt-1">Edit property details and content</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="general" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <Shield className="h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <BookOpen className="h-4 w-4" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <PropertyForm property={data.property} />
        </TabsContent>

        <TabsContent value="rules">
          <RulesEditor propertyId={id} rules={data.rules} />
        </TabsContent>

        <TabsContent value="manual">
          <ManualEditor propertyId={id} sections={data.sections} />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyEditor propertyId={id} items={data.emergency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
