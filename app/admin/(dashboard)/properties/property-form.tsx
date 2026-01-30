"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProperty, updateProperty } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/schema";

interface PropertyFormProps {
  property?: Property;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || "Your guide to a perfect stay",
      heroImage: formData.get("heroImage") as string || null,
      address: formData.get("address") as string,
      pin: formData.get("pin") as string,
      wifiNetwork: formData.get("wifiNetwork") as string || null,
      wifiPassword: formData.get("wifiPassword") as string || null,
      doorCode: formData.get("doorCode") as string || null,
      checkOutTime: formData.get("checkOutTime") as string || "11:00 AM",
      hostName: formData.get("hostName") as string || null,
      hostPhone: formData.get("hostPhone") as string || null,
      hostEmail: formData.get("hostEmail") as string || null,
      localGuideLink: formData.get("localGuideLink") as string || null,
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      try {
        if (property) {
          await updateProperty(property.id, data);
        } else {
          const newProperty = await createProperty(data);
          router.push(`/admin/properties/${newProperty.id}`);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">Property Name *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={property?.title}
              placeholder="Hummingbird House"
              required
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-gray-700">Access PIN *</Label>
            <Input
              id="pin"
              name="pin"
              defaultValue={property?.pin}
              placeholder="1234"
              required
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-gray-700">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            defaultValue={property?.subtitle || "Your guide to a perfect stay"}
            placeholder="Your guide to a perfect stay"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-700">Address *</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={property?.address}
            placeholder="123 Beach Drive, Santa Barbara, CA 93101"
            required
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroImage" className="text-gray-700">Hero Image URL</Label>
          <Input
            id="heroImage"
            name="heroImage"
            defaultValue={property?.heroImage || ""}
            placeholder="https://example.com/image.jpg"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="isActive"
            name="isActive"
            defaultChecked={property?.isActive ?? true}
          />
          <Label htmlFor="isActive" className="text-gray-700">Active (visible to guests)</Label>
        </div>
      </div>

      {/* Access Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">Access Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="wifiNetwork" className="text-gray-700">WiFi Network</Label>
            <Input
              id="wifiNetwork"
              name="wifiNetwork"
              defaultValue={property?.wifiNetwork || ""}
              placeholder="MyWiFiNetwork"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wifiPassword" className="text-gray-700">WiFi Password</Label>
            <Input
              id="wifiPassword"
              name="wifiPassword"
              defaultValue={property?.wifiPassword || ""}
              placeholder="••••••••"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="doorCode" className="text-gray-700">Door Code</Label>
            <Input
              id="doorCode"
              name="doorCode"
              defaultValue={property?.doorCode || ""}
              placeholder="1234#"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOutTime" className="text-gray-700">Check-Out Time</Label>
            <Input
              id="checkOutTime"
              name="checkOutTime"
              defaultValue={property?.checkOutTime || "11:00 AM"}
              placeholder="11:00 AM"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Host Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">Host Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hostName" className="text-gray-700">Host Name</Label>
            <Input
              id="hostName"
              name="hostName"
              defaultValue={property?.hostName || ""}
              placeholder="John Doe"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostPhone" className="text-gray-700">Host Phone</Label>
            <Input
              id="hostPhone"
              name="hostPhone"
              defaultValue={property?.hostPhone || ""}
              placeholder="+1 (555) 123-4567"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostEmail" className="text-gray-700">Host Email</Label>
            <Input
              id="hostEmail"
              name="hostEmail"
              type="email"
              defaultValue={property?.hostEmail || ""}
              placeholder="host@example.com"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="localGuideLink" className="text-gray-700">Local Guide Link</Label>
          <Input
            id="localGuideLink"
            name="localGuideLink"
            defaultValue={property?.localGuideLink || ""}
            placeholder="/local-guide"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {property ? "Save Changes" : "Create Property"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
