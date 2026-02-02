"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { IconPicker } from "../components/icon-picker";
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
import { usePropertyEditor } from "./components/property-editor-context";

export function RulesEditor() {
  const { houseRules, addHouseRule, updateHouseRule, deleteHouseRule } = usePropertyEditor();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">House Rules</h2>
          <p className="text-gray-500 text-sm">Icons shown in the rules row</p>
        </div>
        <Button onClick={addHouseRule} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {houseRules.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
          No rules yet. Add your first house rule.
        </div>
      ) : (
        <div className="space-y-3">
          {houseRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Label</Label>
                  <Input
                    value={rule.label}
                    onChange={(e) => updateHouseRule(rule.id, { label: e.target.value })}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Icon</Label>
                  <IconPicker
                    value={rule.icon || "AlertCircle"}
                    onChange={(icon) => updateHouseRule(rule.id, { icon })}
                  />
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove this house rule permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteHouseRule(rule.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
