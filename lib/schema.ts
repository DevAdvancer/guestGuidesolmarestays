import { pgTable, serial, text, jsonb, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// SETTINGS TABLE
// ============================================
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// ============================================
// PROPERTIES TABLE (Main Guest Guide Data)
// ============================================
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").default("Your guide to a perfect stay"),
  heroImage: text("hero_image"), // URL or base64
  address: text("address").notNull(),
  pin: text("pin").notNull().unique(), // Access PIN

  // WiFi
  wifiNetwork: text("wifi_network"),
  wifiPassword: text("wifi_password"),

  // Access
  doorCode: text("door_code"),
  checkOutTime: text("check_out_time").default("11:00 AM"),

  // Host Info
  hostName: text("host_name"),
  hostPhone: text("host_phone"),
  hostEmail: text("host_email"),

  // Links
  localGuideLink: text("local_guide_link"),

  // Status
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

// ============================================
// HOUSE RULES TABLE
// ============================================
export const houseRules = pgTable("house_rules", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  icon: text("icon").default("AlertCircle"), // Lucide icon name
  sortOrder: integer("sort_order").default(0),
});

export type HouseRule = typeof houseRules.$inferSelect;
export type NewHouseRule = typeof houseRules.$inferInsert;

// ============================================
// MANUAL SECTIONS TABLE (Accordions)
// ============================================
export const manualSections = pgTable("manual_sections", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  icon: text("icon").default("BookOpen"), // Lucide icon name
  checklist: jsonb("checklist").$type<string[]>(), // Array of checklist items
  sortOrder: integer("sort_order").default(0),
});

export type ManualSection = typeof manualSections.$inferSelect;
export type NewManualSection = typeof manualSections.$inferInsert;

// ============================================
// MANUAL ITEMS TABLE (Content within Accordions)
// ============================================
export const manualItems = pgTable("manual_items", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => manualSections.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value"), // Rich text or plain
  icon: text("icon").default("Info"),
  bullets: jsonb("bullets").$type<string[]>(), // Array of bullet points
  highlight: boolean("highlight").default(false),
  sortOrder: integer("sort_order").default(0),
});

export type ManualItem = typeof manualItems.$inferSelect;
export type NewManualItem = typeof manualItems.$inferInsert;

// ============================================
// EMERGENCY ITEMS TABLE
// ============================================
export const emergencyItems = pgTable("emergency_items", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").default("Phone"),
  actionLabel: text("action_label"), // e.g., "Call Now"
  action: text("action"), // e.g., "tel:911"
  link: text("link"), // Optional website link
  address: text("address"), // Optional address
  urgent: boolean("urgent").default(false),
  sortOrder: integer("sort_order").default(0),
});

export type EmergencyItem = typeof emergencyItems.$inferSelect;
export type NewEmergencyItem = typeof emergencyItems.$inferInsert;

// ============================================
// RELATIONS
// ============================================
export const propertiesRelations = relations(properties, ({ many }) => ({
  houseRules: many(houseRules),
  manualSections: many(manualSections),
  emergencyItems: many(emergencyItems),
}));

export const houseRulesRelations = relations(houseRules, ({ one }) => ({
  property: one(properties, {
    fields: [houseRules.propertyId],
    references: [properties.id],
  }),
}));

export const manualSectionsRelations = relations(manualSections, ({ one, many }) => ({
  property: one(properties, {
    fields: [manualSections.propertyId],
    references: [properties.id],
  }),
  items: many(manualItems),
}));

export const manualItemsRelations = relations(manualItems, ({ one }) => ({
  section: one(manualSections, {
    fields: [manualItems.sectionId],
    references: [manualSections.id],
  }),
}));

export const emergencyItemsRelations = relations(emergencyItems, ({ one }) => ({
  property: one(properties, {
    fields: [emergencyItems.propertyId],
    references: [properties.id],
  }),
}));

// ============================================
// LOCAL GUIDE VENDORS TABLE
// ============================================
export const localGuideVendors = pgTable("local_guide_vendors", {
  id: serial("id").primaryKey(),
  vendorName: text("vendor_name").notNull(),
  category: text("category").notNull(), // 'coffee', 'dinner', 'play', 'shops'
  isVipSponsor: boolean("is_vip_sponsor").default(false),
  priceLevel: text("price_level").default("$"), // $, $$, $$$
  iconType: text("icon_type").default("Coffee"), // Lucide icon name
  description: text("description"), // Max 150 chars
  vipDealText: text("vip_deal_text"), // Only for VIP sponsors
  websiteUrl: text("website_url"),
  googleMapsUrl: text("google_maps_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LocalGuideVendor = typeof localGuideVendors.$inferSelect;
export type NewLocalGuideVendor = typeof localGuideVendors.$inferInsert;
