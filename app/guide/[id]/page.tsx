import { db } from "@/lib/db";
import { properties, houseRules, manualSections, manualItems, emergencyItems } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

// Original UI Components
import { Header } from "@/components/header";
import { QuickHitsGrid } from "@/components/quick-hits-grid";
import { LocalGuideFooter } from "./components/local-guide-footer";

// Guide-specific components
import { RulesRow } from "./components/rules-row";
import { ManualAccordion } from "./components/manual-accordion";
import { EmergencySection } from "./components/emergency-section";
import { ContactModal } from "./components/contact-modal";

interface GuidePageProps {
  params: Promise<{ id: string }>;
}

async function getGuideData(id: string) {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id));

  if (!property || !property.isActive) return null;

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

export default async function GuidePage({ params }: GuidePageProps) {
  const { id } = await params;
  const data = await getGuideData(id);

  if (!data) {
    notFound();
  }

  const { property, rules, sections, emergency } = data;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f7f5' }}>
      {/* Sticky Header */}
      <Header contactPhone={property.hostPhone || undefined} />

      {/* Hero Section */}
      <section className="relative h-64 sm:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${property.heroImage || '/images/hero-property.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>
        <div className="absolute inset-0 flex items-end justify-center p-6">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold mb-1">{property.title}</h1>
            <p className="text-white/80">{property.subtitle || "Your guide to a perfect stay"}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-2xl mx-auto space-y-8">
        {/* Quick Info Cards with Flip Effect */}
        <QuickHitsGrid
          wifi={{
            network: property.wifiNetwork || "Not configured",
            password: property.wifiPassword || "",
          }}
          doorCode={property.doorCode || "Contact Host"}
          address={property.address}
          checkOutTime={property.checkOutTime || "11:00 AM"}
        />

        {/* House Rules Row */}
        {rules.length > 0 && <RulesRow rules={rules} />}

        {/* House Manual Accordions */}
        {sections.length > 0 && <ManualAccordion sections={sections} />}

        {/* Emergency Section */}
        {emergency.length > 0 && <EmergencySection items={emergency} />}
      </main>

      {/* Local Guide Footer CTA */}
      <LocalGuideFooter link={property.localGuideLink || "#"} />

      {/* Floating Contact Button */}
      <ContactModal
        hostName={property.hostName}
        hostPhone={property.hostPhone}
        hostEmail={property.hostEmail}
      />
    </div>
  );
}
