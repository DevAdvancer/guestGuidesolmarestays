"use client";

import { useTransition, useRef } from "react";
import { changePasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password changed successfully");
        formRef.current?.reset();
      }
    });
  };

  return (
    <Card className="border-red-100 shadow-sm">
      <CardHeader className="bg-red-50/50 rounded-t-xl border-b border-red-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Lock className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Security</CardTitle>
            <CardDescription>Change your administrator password</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form ref={formRef} action={handleSubmit} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
