import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

// Simple session-based auth check
export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // Verify session exists in neon_auth
    const result = await db.execute(sql`
      SELECT u.id, u.email, u.name, u.role 
      FROM neon_auth.session s
      JOIN neon_auth.user u ON s."userId" = u.id
      WHERE s.token = ${sessionToken}
      AND s."expiresAt" > NOW()
    `);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

export async function createAdminSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.execute(sql`
    INSERT INTO neon_auth.session (id, "userId", token, "expiresAt", "createdAt", "updatedAt", "ipAddress", "userAgent")
    VALUES (${crypto.randomUUID()}, ${userId}, ${token}, ${expiresAt}, NOW(), NOW(), '', '')
  `);

  return token;
}

export async function verifyCredentials(email: string, password: string) {
  const { compareSync } = await import("bcryptjs");

  // Get user and their credential account
  const result = await db.execute(sql`
    SELECT u.id, u.email, u.name, u.role, a.password
    FROM neon_auth.user u
    JOIN neon_auth.account a ON a."userId" = u.id
    WHERE u.email = ${email}
    AND a."providerId" = 'credential'
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0] as {
    id: string;
    email: string;
    name: string;
    role: string;
    password: string;
  };

  if (!user.password || !compareSync(password, user.password)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
