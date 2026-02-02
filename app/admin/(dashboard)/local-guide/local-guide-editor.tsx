"use client";

import { useState } from "react";
import { LocalGuideVendor } from "@/lib/schema";
import { createVendor, updateVendor, deleteVendor, reorderVendors } from "@/actions/local-guide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, GripVertical, Star, ExternalLink, MapPin } from "lucide-react";
import { VendorFormDialog } from "./vendor-form-dialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface LocalGuideEditorProps {
  initialVendors: LocalGuideVendor[];
}

const CATEGORY_LABELS: Record<string, string> = {
  coffee: "Coffee & Casual",
  dinner: "Dinner & Drinks",
  play: "Play & Explore",
  shops: "Shops & Markets",
};

function SortableVendorCard({ vendor, onEdit, onDelete }: {
  vendor: LocalGuideVendor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: vendor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 bg-card rounded-lg border",
        isDragging && "opacity-50"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{vendor.vendorName}</span>
          {vendor.isVipSponsor && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 gap-1">
              <Star className="h-3 w-3" /> VIP
            </Badge>
          )}
          {!vendor.isActive && (
            <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <Badge variant="outline">{CATEGORY_LABELS[vendor.category] || vendor.category}</Badge>
          <span>{vendor.priceLevel}</span>
          {vendor.description && (
            <span className="truncate">{vendor.description}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {vendor.websiteUrl && (
          <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
        {vendor.googleMapsUrl && (
          <a href={vendor.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MapPin className="h-4 w-4" />
            </Button>
          </a>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function LocalGuideEditor({ initialVendors }: LocalGuideEditorProps) {
  const [vendors, setVendors] = useState(initialVendors);
  const [editingVendor, setEditingVendor] = useState<LocalGuideVendor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const vipVendors = vendors.filter(v => v.isVipSponsor);
  const standardVendors = vendors.filter(v => !v.isVipSponsor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = vendors.findIndex(v => v.id === active.id);
    const newIndex = vendors.findIndex(v => v.id === over.id);

    const newVendors = arrayMove(vendors, oldIndex, newIndex);
    setVendors(newVendors);

    await reorderVendors(newVendors.map(v => v.id));
  };

  const handleCreate = () => {
    setEditingVendor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (vendor: LocalGuideVendor) => {
    setEditingVendor(vendor);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    await deleteVendor(id);
    setVendors(vendors.filter(v => v.id !== id));
  };

  const handleSave = async (data: Omit<LocalGuideVendor, "id" | "createdAt">) => {
    if (editingVendor) {
      const updated = await updateVendor(editingVendor.id, data);
      setVendors(vendors.map(v => v.id === editingVendor.id ? updated : v));
    } else {
      const created = await createVendor(data);
      setVendors([...vendors, created]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Vendor
        </Button>
      </div>

      {vipVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              VIP Sponsors ({vipVendors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={vipVendors.map(v => v.id)} strategy={verticalListSortingStrategy}>
                {vipVendors.map(vendor => (
                  <SortableVendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onEdit={() => handleEdit(vendor)}
                    onDelete={() => handleDelete(vendor.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Standard Recommendations ({standardVendors.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {standardVendors.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No standard recommendations yet. Add your first vendor!</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={standardVendors.map(v => v.id)} strategy={verticalListSortingStrategy}>
                {standardVendors.map(vendor => (
                  <SortableVendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onEdit={() => handleEdit(vendor)}
                    onDelete={() => handleDelete(vendor.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <VendorFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vendor={editingVendor}
        onSave={handleSave}
      />
    </div>
  );
}
