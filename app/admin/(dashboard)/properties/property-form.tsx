"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { usePropertyEditor } from "./components/property-editor-context";
import { useState, useCallback, useEffect } from "react";
import { checkPinAvailability } from "@/actions/properties";

export function PropertyForm() {
  const { propertyData, updatePropertyData } = usePropertyEditor();
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Debounced PIN check
  useEffect(() => {
    const checkPin = async () => {
      if (!propertyData.pin || propertyData.pin.length < 4) {
        setPinError(null);
        return;
      }

      setIsCheckingPin(true);
      try {
        const isAvailable = await checkPinAvailability(propertyData.pin, propertyData.id);
        if (!isAvailable) {
          setPinError("This PIN is already in use by another property.");
        } else {
          setPinError(null);
        }
      } catch (error) {
        console.error("Failed to check PIN availability:", error);
      } finally {
        setIsCheckingPin(false);
      }
    };

    const timeoutId = setTimeout(checkPin, 500);
    return () => clearTimeout(timeoutId);
  }, [propertyData.pin, propertyData.id]);

  const handleChange = (field: string, value: string | boolean) => {
    updatePropertyData({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">Property Name *</Label>
            <Input
              id="title"
              value={propertyData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Hummingbird House"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-gray-700">Access PIN *</Label>
            <div className="relative">
              <Input
                id="pin"
                value={propertyData.pin || ""}
                onChange={(e) => handleChange("pin", e.target.value)}
                placeholder="1234"
                className={`bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 ${pinError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {isCheckingPin && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
            {pinError && (
              <p className="text-sm text-red-500 mt-1">{pinError}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-gray-700">Subtitle</Label>
          <Input
            id="subtitle"
            value={propertyData.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Your guide to a perfect stay"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-700">Address *</Label>
          <Textarea
            id="address"
            value={propertyData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="123 Beach Drive, Santa Barbara, CA 93101"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLink" className="text-gray-700">Google Maps Link (Optional)</Label>
          <Input
            id="addressLink"
            value={propertyData.addressLink || ""}
            onChange={(e) => handleChange("addressLink", e.target.value)}
            placeholder="https://maps.google.com/..."
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroImage" className="text-gray-700">Hero Image URL</Label>
          <Input
            id="heroImage"
            value={propertyData.heroImage || ""}
            onChange={(e) => handleChange("heroImage", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="isActive"
            checked={propertyData.isActive ?? true}
            onCheckedChange={(checked) => handleChange("isActive", checked)}
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
              value={propertyData.wifiNetwork || ""}
              onChange={(e) => handleChange("wifiNetwork", e.target.value)}
              placeholder="MyWiFiNetwork"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wifiPassword" className="text-gray-700">WiFi Password</Label>
            <Input
              id="wifiPassword"
              value={propertyData.wifiPassword || ""}
              onChange={(e) => handleChange("wifiPassword", e.target.value)}
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
              value={propertyData.doorCode || ""}
              onChange={(e) => handleChange("doorCode", e.target.value)}
              placeholder="1234#"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOutTime" className="text-gray-700">Check-Out Time</Label>
            <Input
              id="checkOutTime"
              value={propertyData.checkOutTime || ""}
              onChange={(e) => handleChange("checkOutTime", e.target.value)}
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
              value={propertyData.hostName || ""}
              onChange={(e) => handleChange("hostName", e.target.value)}
              placeholder="John Doe"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostPhone" className="text-gray-700">Host Phone</Label>
            <Input
              id="hostPhone"
              value={propertyData.hostPhone || ""}
              onChange={(e) => handleChange("hostPhone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostEmail" className="text-gray-700">Host Email</Label>
            <Input
              id="hostEmail"
              type="email"
              value={propertyData.hostEmail || ""}
              onChange={(e) => handleChange("hostEmail", e.target.value)}
              placeholder="host@example.com"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="localGuideLink" className="text-gray-700">Local Guide Link</Label>
          <Input
            id="localGuideLink"
            value={propertyData.localGuideLink || ""}
            onChange={(e) => handleChange("localGuideLink", e.target.value)}
            placeholder="/local-guide"
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
