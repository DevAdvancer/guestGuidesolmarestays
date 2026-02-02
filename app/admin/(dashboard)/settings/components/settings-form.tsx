"use client";

import { useState, useTransition } from "react";
import { updateSetting } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
  initialSettings: Record<string, any>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        // Save each modified setting
        // In a real app, you might want to batch this or just save the whole object
        const promises = Object.entries(settings).map(([key, value]) =>
          updateSetting(key, value)
        );

        await Promise.all(promises);

        toast.success("Settings saved successfully");
        setDirty(false);
      } catch (error) {
        toast.error("Failed to save settings");
        console.error(error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">General Configuration</h2>

        <div className="grid gap-6 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName || ""}
              onChange={(e) => handleChange("siteName", e.target.value)}
              placeholder="Solmaré Stays"
            />
            <p className="text-xs text-gray-500">The name displayed in the browser tab and main header.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail || ""}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              placeholder="support@solmarestays.com"
            />
            <p className="text-xs text-gray-500">Displayed to guests for help inquiries.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportPhone">Support Phone</Label>
            <Input
              id="supportPhone"
              type="tel"
              value={settings.supportPhone || ""}
              onChange={(e) => handleChange("supportPhone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!dirty || isPending}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white min-w-[120px]"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
