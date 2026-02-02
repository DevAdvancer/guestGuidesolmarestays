"use client";

import { createContext, useContext, useState, useTransition, ReactNode } from "react";
import { type Property } from "@/lib/schema";
import { updateProperty, createProperty } from "@/actions/properties";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PropertyEditorContextType {
  propertyData: Partial<Property>;
  manualSections: any[];
  houseRules: any[];
  emergencyItems: any[];
  isDirty: boolean;
  isSaving: boolean;

  updatePropertyData: (updates: Partial<Property>) => void;

  // Manual
  addManualSection: () => void;
  updateManualSection: (id: number, updates: any) => void;
  deleteManualSection: (id: number) => void;
  reorderManualSectionsList: (sections: any[]) => void;

  addManualItem: (sectionId: number) => void;
  updateManualItem: (sectionId: number, itemId: number, updates: any) => void;
  deleteManualItem: (sectionId: number, itemId: number) => void;
  reorderManualItemsList: (sectionId: number, items: any[]) => void;

  // Rules
  addHouseRule: () => void;
  updateHouseRule: (id: number, updates: any) => void;
  deleteHouseRule: (id: number) => void;
  reorderHouseRulesList: (rules: any[]) => void;

  // Emergency
  addEmergencyItem: () => void;
  updateEmergencyItem: (id: number, updates: any) => void;
  deleteEmergencyItem: (id: number) => void;
  reorderEmergencyItemsList: (items: any[]) => void;

  saveChanges: () => Promise<void>;
}

const PropertyEditorContext = createContext<PropertyEditorContextType | null>(null);

export function usePropertyEditor() {
  const context = useContext(PropertyEditorContext);
  if (!context) {
    throw new Error("usePropertyEditor must be used within a PropertyEditorProvider");
  }
  return context;
}

interface PropertyEditorProviderProps {
  initialData?: {
    property: Property;
    rules: any[];
    sections: any[];
    emergency: any[];
  };
  children: ReactNode;
}

export function PropertyEditorProvider({ initialData, children }: PropertyEditorProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // -- Property Data --
  const [propertyData, setPropertyData] = useState<Partial<Property>>(initialData?.property || {
    title: "",
    subtitle: "Your guide to a perfect stay",
    isActive: true,
    checkOutTime: "11:00 AM"
  });

  // -- Manual Sections Data --
  const [manualSections, setManualSections] = useState(initialData?.sections || []);

  // -- House Rules Data --
  const [houseRules, setHouseRules] = useState(initialData?.rules || []);

  // -- Emergency Items Data --
  const [emergencyItems, setEmergencyItems] = useState(initialData?.emergency || []);

  const [isDirty, setIsDirty] = useState(false);

  // --- Property Helpers ---
  const updatePropertyData = (updates: Partial<Property>) => {
    setPropertyData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  // --- Manual Helpers ---
  const addManualSection = () => {
    // Generate temporary ID (negative)
    const newId = -1 * (Math.floor(Math.random() * 10000) + 1);
    const newSection: any = {
      id: newId,
      propertyId: initialData?.property?.id || "temp",
      title: "New Section",
      subtitle: "",
      icon: "BookOpen",
      checklist: [],
      items: [],
      sortOrder: manualSections.length,
    };
    setManualSections([...manualSections, newSection]);
    setIsDirty(true);
  };

  const updateManualSection = (id: number, updates: any) => {
    setManualSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setIsDirty(true);
  };

  const deleteManualSection = (id: number) => {
    setManualSections((prev) => prev.filter((s) => s.id !== id));
    setIsDirty(true);
  };

  const reorderManualSectionsList = (newSections: any[]) => {
    setManualSections(newSections);
    setIsDirty(true);
  };

  // Manual Items
  const addManualItem = (sectionId: number) => {
    const section = manualSections.find(s => s.id === sectionId);
    if (!section) return;

    const newId = -1 * (Math.floor(Math.random() * 10000) + 1);
    const newItem: any = {
      id: newId,
      sectionId,
      label: "New Item",
      value: "",
      icon: "Info",
      bullets: [],
      highlight: false,
      sortOrder: section.items.length,
    };

    updateManualSection(sectionId, {
      items: [...section.items, newItem]
    });
  };

  const updateManualItem = (sectionId: number, itemId: number, updates: any) => {
    setManualSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map((i: any) => i.id === itemId ? { ...i, ...updates } : i)
        };
      })
    );
    setIsDirty(true);
  };

  const deleteManualItem = (sectionId: number, itemId: number) => {
    setManualSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.filter((i: any) => i.id !== itemId)
        };
      })
    );
    setIsDirty(true);
  };

  const reorderManualItemsList = (sectionId: number, newItems: any[]) => {
    setManualSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: newItems } : s))
    );
    setIsDirty(true);
  };


  // --- Rules Helpers ---
  const addHouseRule = () => {
    const newId = -1 * (Math.floor(Math.random() * 10000) + 1);
    const newRule: any = {
      id: newId,
      propertyId: initialData?.property?.id || "temp",
      title: "New Rule",
      icon: "Info",
      sortOrder: houseRules.length,
    };
    setHouseRules([...houseRules, newRule]);
    setIsDirty(true);
  };

  const updateHouseRule = (id: number, updates: any) => {
    setHouseRules((prev) => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    setIsDirty(true);
  };

  const deleteHouseRule = (id: number) => {
    setHouseRules((prev) => prev.filter(r => r.id !== id));
    setIsDirty(true);
  };

  const reorderHouseRulesList = (newRules: any[]) => {
    setHouseRules(newRules);
    setIsDirty(true);
  };

  // --- Emergency Helpers ---
  const addEmergencyItem = () => {
    const newId = -1 * (Math.floor(Math.random() * 10000) + 1);
    const newItem: any = {
      id: newId,
      propertyId: initialData?.property?.id || "temp",
      title: "New Emergency Contact",
      value: "",
      icon: "AlertTriangle",
      sortOrder: emergencyItems.length,
    };
    setEmergencyItems([...emergencyItems, newItem]);
    setIsDirty(true);
  };

  const updateEmergencyItem = (id: number, updates: any) => {
    setEmergencyItems((prev) => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    setIsDirty(true);
  };

  const deleteEmergencyItem = (id: number) => {
    setEmergencyItems((prev) => prev.filter(i => i.id !== id));
    setIsDirty(true);
  };

  const reorderEmergencyItemsList = (newItems: any[]) => {
    setEmergencyItems(newItems);
    setIsDirty(true);
  };


  const saveChanges = async () => {
    if (!isDirty && initialData) return;

    startTransition(async () => {
      try {
        let propertyId = initialData?.property?.id;

        // Construct the full data payload
        const completeData = {
          property: propertyData,
          manual: manualSections,
          rules: houseRules,
          emergency: emergencyItems,
        };

        // If no property ID, we need to handle creation via the complete action or ensure ID generation
        // The action expects propertyId. If it's new, we might need a temp ID or handle creation differently?
        // Actually, creating a property usually starts with just a title. But here we have a full editor.
        // Let's assume for now we are EDITING mostly. 
        // If creating, we usually create the property first on the dashboard.
        // But if we are in a "new" state, propertyId might be missing.

        if (!propertyId) {
          // Fallback for creation flow if valid
          // For now, let's assume we have an ID or use "new" logic if that was intended.
          // Based on previous code: const newProperty = await createProperty(propertyData as any);
          // We can duplicate that logic or update savePropertyComplete to handle "new" propertyId.
          // BUT, the context provider usually loads with initialData, implying an existing property or a shell.
          // If propertyId is missing, let's try to create the shell first to get an ID.
          const { createProperty } = await import("@/actions/properties");
          const newProperty = await createProperty(propertyData as any);
          propertyId = newProperty.id;
        }

        const { savePropertyComplete } = await import("@/actions/properties");
        await savePropertyComplete(propertyId, completeData as any);

        toast.success("All changes saved successfully");
        setIsDirty(false);
        router.refresh();

        if (!initialData?.property?.id) {
          router.push(`/admin/properties/${propertyId}`);
        }

      } catch (error) {
        console.error("Failed to save property:", error);
        toast.error("Failed to save property");
      }
    });
  };

  return (
    <PropertyEditorContext.Provider
      value={{
        propertyData,
        manualSections,
        houseRules,
        emergencyItems,
        isDirty,
        isSaving: isPending,
        updatePropertyData,

        // Manual
        addManualSection,
        updateManualSection,
        deleteManualSection,
        reorderManualSectionsList,
        addManualItem,
        updateManualItem,
        deleteManualItem,
        reorderManualItemsList,

        // Rules
        addHouseRule,
        updateHouseRule,
        deleteHouseRule,
        reorderHouseRulesList,

        // Emergency
        addEmergencyItem,
        updateEmergencyItem,
        deleteEmergencyItem,
        reorderEmergencyItemsList,

        saveChanges,
      }}
    >
      {children}
    </PropertyEditorContext.Provider>
  );
}
