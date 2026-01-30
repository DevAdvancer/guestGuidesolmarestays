"use client";

import { useTransition } from "react";
import { createEmergencyItem, updateEmergencyItem, deleteEmergencyItem } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { IconPicker } from "../components/icon-picker";
import type { EmergencyItem } from "@/lib/schema";
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

interface EmergencyEditorProps {
  propertyId: string;
  items: EmergencyItem[];
}

export function EmergencyEditor({ propertyId, items }: EmergencyEditorProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      await createEmergencyItem({
        propertyId,
        title: "New Emergency Contact",
        description: "",
        icon: "Phone",
        actionLabel: "",
        action: "",
        urgent: false,
        sortOrder: items.length,
      });
    });
  };

  const handleUpdate = (id: number, data: Partial<EmergencyItem>) => {
    startTransition(async () => {
      await updateEmergencyItem(id, data);
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteEmergencyItem(id, propertyId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
          <p className="text-gray-500 text-sm">Safety information shown in collapsible section</p>
        </div>
        <Button onClick={handleAdd} disabled={isPending} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
          No emergency contacts yet. Add important safety information.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Title</Label>
                  <Input
                    defaultValue={item.title}
                    onBlur={(e) => {
                      if (e.target.value !== item.title) {
                        handleUpdate(item.id, { title: e.target.value });
                      }
                    }}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Icon</Label>
                  <IconPicker
                    value={item.icon || "Phone"}
                    onChange={(icon) => handleUpdate(item.id, { icon })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Description</Label>
                <Textarea
                  defaultValue={item.description || ""}
                  onBlur={(e) => {
                    if (e.target.value !== item.description) {
                      handleUpdate(item.id, { description: e.target.value });
                    }
                  }}
                  className="bg-gray-50 border-gray-300 text-gray-900 min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Action Label</Label>
                  <Input
                    defaultValue={item.actionLabel || ""}
                    placeholder="Display text (e.g. Call Host)"
                    onBlur={(e) => {
                      if (e.target.value !== item.actionLabel) {
                        handleUpdate(item.id, { actionLabel: e.target.value });
                      }
                    }}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Action (tel:, https://)</Label>
                  <Input
                    defaultValue={item.action || ""}
                    placeholder="tel: or https://"
                    onBlur={(e) => {
                      if (e.target.value !== item.action) {
                        handleUpdate(item.id, { action: e.target.value });
                      }
                    }}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1">

                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Address (optional)</Label>
                  <Input
                    defaultValue={item.address || ""}
                    placeholder="123 Main St, City"
                    onBlur={(e) => {
                      if (e.target.value !== item.address) {
                        handleUpdate(item.id, { address: e.target.value || null });
                      }
                    }}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.urgent || false}
                    onCheckedChange={(checked) => handleUpdate(item.id, { urgent: checked })}
                  />
                  <Label className="text-sm text-gray-700">Mark as Urgent</Label>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove this emergency contact permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
