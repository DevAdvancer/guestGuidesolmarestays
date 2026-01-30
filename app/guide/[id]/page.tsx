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
import { HeroHelpButton } from "./components/hero-help-button";

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

      {/* Hero Section - Fullscreen style with centered content */}
      <section className="relative min-h-[100dvh] flex items-center justify-start mt-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${property.heroImage || '/images/hero-property.jpg'})`,
          }}
        >
          {/* Main dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Gradient at bottom for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center p-6 md:p-12 lg:p-20 text-left w-full h-full space-y-8 pt-20 max-w-7xl mx-auto">
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight text-balance leading-tight drop-shadow-md">
              {property.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-medium max-w-3xl text-balance drop-shadow-sm">
              {property.subtitle || "Your guide to a perfect stay"}
            </p>
          </div>

          <div className="pt-4">
            <HeroHelpButton contactPhone={property.hostPhone || undefined} />
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
