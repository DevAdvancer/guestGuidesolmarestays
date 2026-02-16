"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SharePropertyButtonProps {
  propertyId: string;
  propertyTitle: string;
}

export function SharePropertyButton({ propertyId, propertyTitle }: SharePropertyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Construct the URL. Assumes the app is running on the current origin.
      const url = `${window.location.origin}/guide/${propertyId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      onClick={handleCopy}
      title="Copy Link"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      <span className="sr-only">Share {propertyTitle}</span>
    </Button>
  );
}
