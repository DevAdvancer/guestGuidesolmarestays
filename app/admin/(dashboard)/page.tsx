import Link from "next/link";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { Building2, Plus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getStats() {
  const allProperties = await db.select().from(properties);
  const activeCount = allProperties.filter((p) => p.isActive).length;
  return {
    total: allProperties.length,
    active: activeCount,
    inactive: allProperties.length - activeCount,
  };
}

async function getRecentProperties() {
  return await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(5);
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentProperties = await getRecentProperties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Solmaré Admin</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg">
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            New Property
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Inactive</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
        </div>
        {recentProperties.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No properties yet</p>
            <Button asChild variant="link" className="text-amber-600 mt-2">
              <Link href="/admin/properties/new">Create your first property</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentProperties.map((property) => (
              <Link
                key={property.id}
                href={`/admin/properties/${property.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-500">PIN: {property.pin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${property.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {property.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {recentProperties.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link
              href="/admin/properties"
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              View all properties →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
