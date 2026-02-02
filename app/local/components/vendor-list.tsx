import { LocalGuideVendor } from "@/lib/schema";
import { StandardCard } from "./standard-card";

interface VendorListProps {
  vendors: LocalGuideVendor[];
  activeCategory: string;
}

export function VendorList({ vendors, activeCategory }: VendorListProps) {
  const filteredVendors = activeCategory === "all"
    ? vendors
    : vendors.filter(v => v.category === activeCategory);

  if (filteredVendors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#B1BFBF] font-serif italic">
          No recommendations found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredVendors.map((vendor) => (
        <StandardCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
