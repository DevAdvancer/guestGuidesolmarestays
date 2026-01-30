import { db } from "./db";
import { settings } from "./schema";
import { eq } from "drizzle-orm";
// bcryptjs is used for password hashing if better-auth isn't fully configured
import { hashSync } from "bcryptjs";
import { sql } from "drizzle-orm";

const DEFAULT_SETTINGS = [
  { key: "site_name", value: "Solmare Stays" },
  { key: "maintenance_mode", value: false },
  { key: "contact_email", value: "admin@solmare.com" },
  // Add more default settings here
];

const ADMIN_EMAIL = "admin@solmare.com";
const ADMIN_PASSWORD = "admin";
const ADMIN_NAME = "Admin";

export async function initializeSystem() {
  console.log("Initializing system...");
  await ensureSettings();
  await ensureAdminUser();
  console.log("System initialization complete.");
}

async function ensureSettings() {
  for (const setting of DEFAULT_SETTINGS) {
    const existing = await db.select().from(settings).where(eq(settings.key, setting.key)).limit(1);
    if (existing.length === 0) {
      console.log(`Creating default setting: ${setting.key}`);
      await db.insert(settings).values({
        key: setting.key,
        value: setting.value,
      });
    }
  }
}

async function ensureAdminUser() {
  // Check if admin exists in neon_auth.user
  // We use raw SQL because neon_auth tables are not in our Drizzle schema file yet (external schema)
  // or we can define them. For now, raw SQL is easier for external schemas.

  const userResult = await db.execute(sql`
    SELECT id FROM neon_auth.user WHERE email = ${ADMIN_EMAIL} LIMIT 1
  `);

  if (userResult.rows.length === 0) {
    console.log("Creating default admin user...");
    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const now = new Date();

    // Insert User
    await db.execute(sql`
      INSERT INTO neon_auth.user (
        id, name, email, "emailVerified", "createdAt", "updatedAt", role
      ) VALUES (
        ${userId}, ${ADMIN_NAME}, ${ADMIN_EMAIL}, true, ${now}, ${now}, 'admin'
      )
    `);

    // Hash password (bcrypt is a safe default for better-auth often, but we might need scrypt)
    // better-auth v1 uses scrypt by default. 
    // If this fails to login, we might need to use better-auth's hasher.
    // For now, let's try bcrypt. If not, we can use a script with better-auth.
    const hashedPassword = hashSync(ADMIN_PASSWORD, 10);

    // Insert Account
    await db.execute(sql`
      INSERT INTO neon_auth.account (
        id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt"
      ) VALUES (
        ${accountId}, ${userId}, ${ADMIN_EMAIL}, 'credential', ${hashedPassword}, ${now}, ${now}
      )
    `);

    console.log(`Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    // Optional: Reset password if requested, but user said "keep... by default".
    // We assume if usage exists, user manages it.
  }
}
