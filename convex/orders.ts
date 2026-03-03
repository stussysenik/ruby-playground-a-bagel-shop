import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    items: v.array(v.object({ name: v.string(), price: v.number() })),
    total: v.number(),
  },
  handler: async (ctx, { userId, items, total }) => {
    return await ctx.db.insert("orders", {
      userId,
      items,
      total,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_createdAt")
      .order("desc")
      .take(20);
  },
});
