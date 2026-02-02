"use client";

import { useTransition } from "react";
import { duplicateProperty } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DuplicatePropertyButtonProps {
  propertyId: string;
}

export function DuplicatePropertyButton({ propertyId }: DuplicatePropertyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDuplicate = () => {
    startTransition(async () => {
      try {
        const result = await duplicateProperty(propertyId);
        if (result.success) {
          toast.success("Property duplicated successfully");
          router.push(`/admin/properties/${result.newPropertyId}`);
        }
      } catch (error) {
        toast.error("Failed to duplicate property");
        console.error(error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleDuplicate}
      className="text-gray-500 hover:text-amber-600 hover:bg-amber-50"
      title="Duplicate Property"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
