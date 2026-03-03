import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  menu_items: defineTable({
    itemId: v.string(),
    name: v.string(),
    label: v.string(),
    desc: v.string(),
    price: v.number(),
    locked: v.boolean(),
    unlockThreshold: v.number(),
    bagelStyle: v.string(),
    emoji: v.string(),
  }).index("by_itemId", ["itemId"]),

  user_profiles: defineTable({
    userId: v.string(),
    xp: v.number(),
    level: v.number(),
    achievements: v.array(v.string()),
    passportStamps: v.array(v.string()),
    streak: v.number(),
    lastVisit: v.string(),
    cartItems: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
      })
    ),
    sectionsVisited: v.array(v.string()),
  }).index("by_userId", ["userId"]),

  drops: defineTable({
    name: v.string(),
    price: v.number(),
    totalStock: v.number(),
    remainingStock: v.number(),
    dropTime: v.number(),
    active: v.boolean(),
    bagelStyle: v.string(),
  }),

  testimonials: defineTable({
    quote: v.string(),
    author: v.string(),
    handle: v.string(),
    avatar: v.string(),
    stars: v.number(),
    order: v.number(),
  }).index("by_order", ["order"]),

  live_ticker: defineTable({
    customerName: v.string(),
    item: v.string(),
    location: v.string(),
    isSimulated: v.boolean(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  orders: defineTable({
    userId: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
      })
    ),
    total: v.number(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
