"use client";

import { useForm } from "react-hook-form";
import { LocalGuideVendor } from "@/lib/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: LocalGuideVendor | null;
  onSave: (data: Omit<LocalGuideVendor, "id" | "createdAt">) => Promise<void>;
}

const CATEGORIES = [
  { value: "coffee", label: "Coffee & Casual" },
  { value: "dinner", label: "Dinner & Drinks" },
  { value: "play", label: "Play & Explore" },
  { value: "shops", label: "Shops & Markets" },
];

const PRICE_LEVELS = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
];

const ICON_TYPES = [
  { value: "Coffee", label: "Coffee" },
  { value: "Wine", label: "Wine" },
  { value: "UtensilsCrossed", label: "Food/Restaurant" },
  { value: "Mountain", label: "Hiking/Nature" },
  { value: "ShoppingBag", label: "Shopping" },
  { value: "Waves", label: "Beach/Water" },
  { value: "Bike", label: "Biking" },
  { value: "Camera", label: "Sightseeing" },
  { value: "Music", label: "Music/Nightlife" },
  { value: "Palette", label: "Art/Culture" },
  { value: "Heart", label: "Wellness/Spa" },
  { value: "Sparkles", label: "Special" },
];

interface FormData {
  vendorName: string;
  category: string;
  isVipSponsor: boolean;
  priceLevel: string;
  iconType: string;
  description: string;
  vipDealText: string;
  websiteUrl: string;
  googleMapsUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export function VendorFormDialog({ open, onOpenChange, vendor, onSave }: VendorFormDialogProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      vendorName: "",
      category: "coffee",
      isVipSponsor: false,
      priceLevel: "$",
      iconType: "Coffee",
      description: "",
      vipDealText: "",
      websiteUrl: "",
      googleMapsUrl: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  const isVip = watch("isVipSponsor");

  useEffect(() => {
    if (vendor) {
      reset({
        vendorName: vendor.vendorName,
        category: vendor.category,
        isVipSponsor: vendor.isVipSponsor ?? false,
        priceLevel: vendor.priceLevel ?? "$",
        iconType: vendor.iconType ?? "Coffee",
        description: vendor.description ?? "",
        vipDealText: vendor.vipDealText ?? "",
        websiteUrl: vendor.websiteUrl ?? "",
        googleMapsUrl: vendor.googleMapsUrl ?? "",
        isActive: vendor.isActive ?? true,
        sortOrder: vendor.sortOrder ?? 0,
      });
    } else {
      reset({
        vendorName: "",
        category: "coffee",
        isVipSponsor: false,
        priceLevel: "$",
        iconType: "Coffee",
        description: "",
        vipDealText: "",
        websiteUrl: "",
        googleMapsUrl: "",
        isActive: true,
        sortOrder: 0,
      });
    }
  }, [vendor, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendorName">Vendor Name *</Label>
            <Input id="vendorName" {...register("vendorName", { required: true })} placeholder="e.g., Oceanside Coffee" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={watch("category")} onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isVipSponsor">VIP Sponsor</Label>
            <Switch
              id="isVipSponsor"
              checked={watch("isVipSponsor")}
              onCheckedChange={(checked) => setValue("isVipSponsor", checked)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceLevel">Price Level</Label>
              <Select value={watch("priceLevel")} onValueChange={(value) => setValue("priceLevel", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_LEVELS.map(price => (
                    <SelectItem key={price.value} value={price.value}>{price.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconType">Icon</Label>
              <Select value={watch("iconType")} onValueChange={(value) => setValue("iconType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_TYPES.map(icon => (
                    <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (max 150 chars)</Label>
            <Textarea
              id="description"
              {...register("description", { maxLength: 150 })}
              placeholder="Short vibe description..."
              maxLength={150}
              rows={2}
            />
          </div>

          {isVip && (
            <div className="space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Label htmlFor="vipDealText">VIP Deal Text *</Label>
              <Input
                id="vipDealText"
                {...register("vipDealText")}
                placeholder="e.g., FREE TASTING or 20% OFF"
              />
              <p className="text-xs text-muted-foreground">Displayed on the back of the flip card</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" type="url" {...register("websiteUrl")} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
            <Input id="googleMapsUrl" type="url" {...register("googleMapsUrl")} placeholder="https://maps.google.com/..." />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
