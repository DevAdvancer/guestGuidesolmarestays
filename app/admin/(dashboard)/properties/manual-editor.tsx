"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createManualSection,
  updateManualSection,
  deleteManualSection,
  createManualItem,
  updateManualItem,
  deleteManualItem,
  reorderManualSections,
  reorderManualItems,
} from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, X, Sparkles, GripVertical } from "lucide-react";
import { IconPicker } from "../components/icon-picker";
import type { ManualSection, ManualItem } from "@/lib/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ManualEditorProps {
  propertyId: string;
  sections: (ManualSection & { items: ManualItem[] })[];
}

export function ManualEditor({ propertyId, sections: initialSections }: ManualEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState(initialSections);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSection = () => {
    startTransition(async () => {
      await createManualSection({
        propertyId,
        title: "New Section",
        subtitle: "",
        icon: "BookOpen",
        checklist: null,
        sortOrder: sections.length,
      });
    });
  };

  const handleUpdateSection = (id: number, data: Partial<ManualSection>) => {
    startTransition(async () => {
      await updateManualSection(id, data);
    });
  };

  const handleDeleteSection = (id: number) => {
    startTransition(async () => {
      await deleteManualSection(id, propertyId);
    });
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      startTransition(async () => {
        await reorderManualSections(propertyId, newSections.map((s) => s.id));
      });
    }
  };

  const handleAddItem = (sectionId: number) => {
    startTransition(async () => {
      await createManualItem(
        {
          sectionId,
          label: "New Item",
          value: "",
          icon: "Info",
          bullets: null,
          highlight: false,
          sortOrder: 0,
        },
        propertyId
      );
    });
  };

  const handleUpdateItem = (id: number, data: Partial<ManualItem>) => {
    startTransition(async () => {
      await updateManualItem(id, data, propertyId);
    });
  };

  const handleDeleteItem = (id: number) => {
    startTransition(async () => {
      await deleteManualItem(id, propertyId);
    });
  };

  const handleItemDragEnd = (sectionId: number, items: ManualItem[], event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update local state
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, items: newItems } : s
        )
      );

      startTransition(async () => {
        await reorderManualItems(propertyId, sectionId, newItems.map((i) => i.id));
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">House Manual</h2>
          <p className="text-gray-500 text-sm">Drag to reorder sections and items</p>
        </div>
        <Button onClick={handleAddSection} disabled={isPending} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
          No manual sections yet. Add your first section.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  propertyId={propertyId}
                  sensors={sensors}
                  onUpdateSection={handleUpdateSection}
                  onDeleteSection={handleDeleteSection}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onItemDragEnd={handleItemDragEnd}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// Sortable Section Component
function SortableSection({
  section,
  propertyId,
  sensors,
  onUpdateSection,
  onDeleteSection,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onItemDragEnd,
}: {
  section: ManualSection & { items: ManualItem[] };
  propertyId: string;
  sensors: any;
  onUpdateSection: (id: number, data: Partial<ManualSection>) => void;
  onDeleteSection: (id: number) => void;
  onAddItem: (sectionId: number) => void;
  onUpdateItem: (id: number, data: Partial<ManualItem>) => void;
  onDeleteItem: (id: number) => void;
  onItemDragEnd: (sectionId: number, items: ManualItem[], event: DragEndEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="multiple" className="space-y-0">
        <AccordionItem
          value={`section-${section.id}`}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="flex items-center">
            {/* Drag Handle - Outside AccordionTrigger */}
            <div
              className="cursor-grab active:cursor-grabbing p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </div>

            <AccordionTrigger className="flex-1 px-4 py-3 hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-3 flex-1 text-left">
                <span className="font-medium text-gray-900">{section.title}</span>
                {section.subtitle && (
                  <span className="text-sm text-gray-500">— {section.subtitle}</span>
                )}
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 pb-4 space-y-4">
            {/* Section Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Title</Label>
                <Input
                  defaultValue={section.title}
                  onBlur={(e) => {
                    if (e.target.value !== section.title) {
                      onUpdateSection(section.id, { title: e.target.value });
                    }
                  }}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Subtitle</Label>
                <Input
                  defaultValue={section.subtitle || ""}
                  onBlur={(e) => {
                    if (e.target.value !== section.subtitle) {
                      onUpdateSection(section.id, { subtitle: e.target.value });
                    }
                  }}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Icon</Label>
                <IconPicker
                  value={section.icon || "BookOpen"}
                  onChange={(icon) => onUpdateSection(section.id, { icon })}
                />
              </div>
            </div>

            {/* Checklist */}
            <ChecklistEditor
              checklist={section.checklist || []}
              onChange={(checklist) => onUpdateSection(section.id, { checklist })}
            />

            {/* Items with Drag and Drop */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Items (drag to reorder)</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddItem(section.id)}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>

              {section.items.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No items in this section</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => onItemDragEnd(section.id, section.items, event)}
                >
                  <SortableContext items={section.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          onUpdate={(data) => onUpdateItem(item.id, data)}
                          onDelete={() => onDeleteItem(item.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Delete Section */}
            <div className="pt-4 border-t border-gray-200">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Section
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this section and all its items.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteSection(section.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Sortable Item Component
function SortableItem({
  item,
  onUpdate,
  onDelete,
}: {
  item: ManualItem;
  onUpdate: (data: Partial<ManualItem>) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [bullets, setBullets] = useState<string[]>(item.bullets || []);

  const handleAddBullet = () => {
    const updated = [...bullets, ""];
    setBullets(updated);
  };

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    setBullets(updated);
  };

  const handleRemoveBullet = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    setBullets(updated);
    onUpdate({ bullets: updated });
  };

  const handleBulletsBlur = () => {
    const filtered = bullets.filter(b => b.trim() !== "");
    onUpdate({ bullets: filtered.length > 0 ? filtered : null });
  };

  // Local state for highlight to make toggle work immediately
  const [isHighlighted, setIsHighlighted] = useState(item.highlight || false);

  const handleHighlightChange = (checked: boolean) => {
    setIsHighlighted(checked);
    onUpdate({ highlight: checked });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg p-3 space-y-3 ${isHighlighted ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}
    >
      <div className="flex items-start gap-2">
        <div
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 mt-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Label</Label>
            <Input
              defaultValue={item.label}
              onBlur={(e) => {
                if (e.target.value !== item.label) {
                  onUpdate({ label: e.target.value });
                }
              }}
              className="bg-white border-gray-300 h-8 text-sm text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Icon</Label>
            <IconPicker
              value={item.icon || "Info"}
              onChange={(icon) => onUpdate({ icon })}
              className="h-8"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 pl-8">
        <Label className="text-xs text-gray-500">Content</Label>
        <Textarea
          defaultValue={item.value || ""}
          onBlur={(e) => {
            if (e.target.value !== item.value) {
              onUpdate({ value: e.target.value });
            }
          }}
          className="bg-white border-gray-300 text-sm min-h-[60px] text-gray-900"
        />
      </div>

      {/* Bullets */}
      <div className="space-y-2 pl-8">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Bullet Points (optional)</Label>
          <Button size="sm" variant="ghost" onClick={handleAddBullet} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Bullet
          </Button>
        </div>
        {bullets.length > 0 && (
          <div className="space-y-1">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <Input
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  onBlur={handleBulletsBlur}
                  className="bg-white border-gray-300 h-7 text-xs flex-1 text-gray-900"
                />
                <Button size="icon" variant="ghost" onClick={() => handleRemoveBullet(index)} className="h-6 w-6 text-red-500">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Highlight + Actions */}
      <div className="flex items-center justify-between pt-2 pl-8">
        <div className="flex items-center gap-2">
          <Switch
            checked={isHighlighted}
            onCheckedChange={handleHighlightChange}
          />
          <Label className="text-xs text-gray-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Highlight
          </Label>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove this item from the manual.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// Checklist Editor Component
function ChecklistEditor({ checklist, onChange }: { checklist: string[]; onChange: (items: string[]) => void }) {
  const [items, setItems] = useState<string[]>(checklist);

  const handleAdd = () => {
    const updated = [...items, ""];
    setItems(updated);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(updated);
  };

  const handleBlur = () => {
    const filtered = items.filter(item => item.trim() !== "");
    onChange(filtered);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-700">Checklist (optional)</Label>
        <Button size="sm" variant="outline" onClick={handleAdd} className="border-gray-300 hover:bg-gray-100">
          <Plus className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No checklist items. Add items for departure reminders.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                onBlur={handleBlur}
                placeholder="Turn off A/C..."
                className="bg-white border-gray-300 h-8 text-sm flex-1 text-gray-900"
              />
              <Button size="icon" variant="ghost" onClick={() => handleRemove(index)} className="h-8 w-8 text-red-500 hover:text-red-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
