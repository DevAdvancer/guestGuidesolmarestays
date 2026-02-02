"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials, createAdminSession, requireAdmin } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await verifyCredentials(email, password);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (user.role !== "admin") {
    return { error: "Access denied. Admin privileges required." };
  }

  const sessionToken = await createAdminSession(user.id);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  try {
    // 1. Verify Authentication
    const user = await requireAdmin();

    // 2. Verify Old Password
    // We reuse verifyCredentials which checks email + password against DB
    const verification = await verifyCredentials(user.email, currentPassword);
    if (!verification) {
      return { error: "Incorrect current password" };
    }

    // 3. Hash New Password
    const { hash } = await import("bcryptjs");
    const hashedPassword = await hash(newPassword, 10);

    // 4. Update Database
    // Note: We need to import db and sql here as they are needed for the update
    // We already have db imported in lib/auth.ts but not here.
    // Let's rely on importing them.
    const { db } = await import("@/lib/db");
    const { sql } = await import("drizzle-orm");

    await db.execute(sql`
      UPDATE neon_auth.account 
      SET password = ${hashedPassword}, "updatedAt" = NOW()
      WHERE "userId" = ${user.id} 
      AND "providerId" = 'credential'
    `);

    return { success: true };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Failed to change password. Please try again." };
  }
}
