import { getVendors, getVipVendors } from "@/actions/local-guide";
import { Header } from "@/components/header";
import { LocalGuideContent } from "./components/local-guide-content";

export const metadata = {
  title: "Live Like a Local | Solmaré Stays",
  description: "Curated local recommendations and exclusive VIP deals from Solmaré Stays",
};

export default async function LocalGuidePage() {
  const [vendors, vipVendors] = await Promise.all([
    getVendors(),
    getVipVendors(),
  ]);

  // Filter out VIP vendors from main list (they show in carousel)
  const standardVendors = vendors.filter(v => !v.isVipSponsor);

  return (
    <>
      <Header />
      <LocalGuideContent
        vipVendors={vipVendors}
        standardVendors={standardVendors}
      />
    </>
  );
}
