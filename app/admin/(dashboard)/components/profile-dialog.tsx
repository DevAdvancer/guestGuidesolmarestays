"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Mail, Shield } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface User {
  id: string;
  email: string;
  role: string;
  image?: string | null;
  name?: string | null;
}

interface ProfileDialogProps {
  children: React.ReactNode;
  user: User;
}

export function ProfileDialog({ children, user }: ProfileDialogProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your account session and view details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-sm">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-amber-100 text-amber-700 text-xl font-bold">
              {user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg text-gray-900">{user.name || "Admin User"}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="w-full space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="flex-1 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="flex-1 capitalize">{user.role} Access</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center border-t border-gray-100 pt-4 mt-2">
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
