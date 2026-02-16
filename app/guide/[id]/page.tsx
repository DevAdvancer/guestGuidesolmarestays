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
// Update import
// Update import
import { verifyGuestToken } from "@/lib/guest-auth";
import { PinEntryForm } from "@/components/guide/pin-entry-form";
import { HeroHelpButton } from "./components/hero-help-button";
import { UrlCleaner } from "@/components/guide/url-cleaner";

interface GuidePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ access?: string }>;
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

export default async function GuidePage({ params, searchParams }: GuidePageProps) {
  const { id } = await params;
  const { access } = await searchParams;

  // Verify the token from the URL
  const isAuthenticated = await verifyGuestToken(access || "", id);

  const data = await getGuideData(id);

  if (!data) {
    notFound();
  }

  const { property, rules, sections, emergency } = data;

  if (!isAuthenticated) {
    return (
      <PinEntryForm
        propertyId={id}
        propertyTitle={property.title}
        propertyImage={property.heroImage}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf9f8' }}>
      {/* Sticky Header */}
      <Header contactPhone={property.hostPhone || undefined} />

      {/* Hero Section - Fullscreen style with centered content */}
      {/* Hero Section - Layered Design */}
      {/* Hero Section - Layered Design */}
      <section className="relative h-[85vh] w-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${property.heroImage || '/images/hero-property.jpg'})`,
          }}
        >
          {/* Main dark overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </section>

      {/* Overlapping Content Wrapper */}
      <div className="relative z-10 -mt-32 flex flex-col items-center px-4 pb-8 space-y-8">

        {/* Floating Transparent Content Box */}
        <div className="w-[90%] max-w-4xl rounded-3xl bg-white/80 backdrop-blur-md p-8 text-center shadow-lg md:p-12 border border-white/50">
          <div className="flex min-h-[160px] flex-col justify-center space-y-4">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-[#556D78] md:text-6xl text-balance">
              {property.title}
            </h1>
            <p className="text-xl font-medium text-[#8BABA5] md:text-2xl text-balance">
              {property.subtitle || "Your guide to a perfect stay"}
            </p>
          </div>
        </div>

        {/* Main Content Info Grid */}
        <main className="w-full max-w-2xl mx-auto space-y-8">
          {/* Quick Info Cards with Flip Effect */}
          <QuickHitsGrid
            wifi={{
              network: property.wifiNetwork || "Not configured",
              password: property.wifiPassword || "",
            }}
            doorCode={property.doorCode || "Contact Host"}
            address={property.address}
            addressLink={property.addressLink}
            checkOutTime={property.checkOutTime || "11:00 AM"}
          />

          {/* House Rules Row */}
          {rules.length > 0 && <RulesRow rules={rules} />}

          {/* House Manual Accordions */}
          {sections.length > 0 && <ManualAccordion sections={sections} />}

          {/* Emergency Section */}
          {emergency.length > 0 && <EmergencySection items={emergency} />}
        </main>
      </div>

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
