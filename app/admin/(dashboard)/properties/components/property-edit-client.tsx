"use client";

import { PropertyEditorProvider, usePropertyEditor } from "./property-editor-context";
import { PropertyForm } from "../property-form";
import { RulesEditor } from "../rules-editor";
import { ManualEditor } from "../manual-editor";
import { EmergencyEditor } from "../emergency-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Shield, BookOpen, AlertTriangle, Loader2, Save } from "lucide-react";
import { Property, HouseRule, ManualSection, ManualItem, EmergencyItem } from "@/lib/schema";

interface PropertyEditClientProps {
  initialData?: {
    property: Property;
    rules: HouseRule[];
    sections: (ManualSection & { items: ManualItem[] })[];
    emergency: EmergencyItem[];
  };
}

function PropertyEditHeader({ title }: { title: string }) {
  const { isDirty, isSaving, saveChanges } = usePropertyEditor();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title || "New Property"}</h1>
        <p className="text-gray-500 mt-1">Edit property details and content</p>
      </div>
      <Button
        onClick={saveChanges}
        disabled={isSaving || !isDirty}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}

function PropertyEditContent({ initialData }: PropertyEditClientProps) {
  const { propertyData } = usePropertyEditor();
  const title = propertyData.title || initialData?.property.title || "";

  return (
    <div className="space-y-6">
      <PropertyEditHeader title={title} />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="general" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <Shield className="h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <BookOpen className="h-4 w-4" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <PropertyForm />
        </TabsContent>

        <TabsContent value="rules">
          {initialData?.property && (
            <RulesEditor propertyId={initialData.property.id} rules={initialData.rules} />
          )}
        </TabsContent>

        <TabsContent value="manual">
          {initialData?.property && (
            <ManualEditor propertyId={initialData.property.id} sections={initialData.sections} />
          )}
        </TabsContent>

        <TabsContent value="emergency">
          {initialData?.property && (
            <EmergencyEditor propertyId={initialData.property.id} items={initialData.emergency} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PropertyEditClient({ initialData }: PropertyEditClientProps) {
  return (
    <PropertyEditorProvider initialData={initialData}>
      <PropertyEditContent initialData={initialData} />
    </PropertyEditorProvider>
  );
}
