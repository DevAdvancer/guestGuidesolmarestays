import { getAllVendors } from "@/actions/local-guide";
import { LocalGuideEditor } from "./local-guide-editor";

export default async function LocalGuidePage() {
  const vendors = await getAllVendors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Local Guide</h1>
        <p className="text-muted-foreground">
          Manage local recommendations and VIP sponsor partnerships
        </p>
      </div>

      <LocalGuideEditor initialVendors={vendors} />
    </div>
  );
}
