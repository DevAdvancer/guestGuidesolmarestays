"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { verifyPropertyPin } from "@/actions/verify-property-pin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PinEntryFormProps {
  propertyId: string;
  propertyTitle?: string;
  propertyImage?: string | null;
}

export function PinEntryForm({ propertyId, propertyTitle, propertyImage }: PinEntryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("propertyId", propertyId);

    startTransition(async () => {
      try {
        const result = await verifyPropertyPin(formData);

        if (result?.success && result.token) {
          // Redirect with the token in the URL using hard redirect
          const url = new URL(window.location.href);
          url.searchParams.set("access", result.token);
          window.location.href = url.toString();
          return;
        }

        if (result?.error) {
          setError(result.error);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
            {propertyImage ? (
              <Image
                src={propertyImage}
                alt={propertyTitle || "Property"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Solmaré Logo"
                fill
                className="object-cover"
                priority
              />
            )}

          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {propertyTitle || "Welcome"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your access PIN for this property
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Guest Access</CardTitle>
            <CardDescription>
              Please enter the 4-digit PIN provided in your check-in instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="pin"
                  placeholder="Enter PIN"
                  required
                  className="text-center text-lg tracking-widest"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  disabled={isPending}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive text-center font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Guide"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground pt-8">
          Need help? <a href="tel:+18052426411" className="underline hover:text-primary">Contact Management</a>
        </p>
      </div>
    </div>
  );
}
