import Link from "next/link";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { Building2, Plus, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeletePropertyButton } from "./components/delete-property-button";
import { DuplicatePropertyButton } from "./components/duplicate-property-button";

async function getAllProperties() {
  return await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt));
}

export default async function PropertiesListPage() {
  const allProperties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your guest guide properties</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg">
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            New Property
          </Link>
        </Button>
      </div>

      {allProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first property to get started with guest guides.
          </p>
          <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Link href="/admin/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Property
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {allProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>PIN: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{property.pin}</code></span>

                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${property.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {property.isActive ? "Active" : "Inactive"}
                </span>
                <Button asChild variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                  <Link href={`/?pin=${property.pin}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                  <Link href={`/admin/properties/${property.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DuplicatePropertyButton propertyId={property.id} />
                <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
