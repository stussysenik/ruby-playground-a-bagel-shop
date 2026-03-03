import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getActiveDrop = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("drops")
      .filter((q) => q.eq(q.field("active"), true))
      .first();
  },
});

export const decrementStock = mutation({
  args: { dropId: v.id("drops") },
  handler: async (ctx, { dropId }) => {
    const drop = await ctx.db.get(dropId);
    if (!drop || drop.remainingStock <= 0) return false;

    await ctx.db.patch(dropId, {
      remainingStock: drop.remainingStock - 1,
    });
    return true;
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("drops").first();
    if (existing) return "already seeded";

    // Drop time is 6 hours from now
    const dropTime = Date.now() + 6 * 60 * 60 * 1000;

    await ctx.db.insert("drops", {
      name: "Ruby Red Velvet",
      price: 28,
      totalStock: 200,
      remainingStock: 47,
      dropTime,
      active: true,
      bagelStyle:
        "background: radial-gradient(circle at 40% 35%, #f0d88a 0%, #c8a257 15%, #8b1a1a 40%, #5a0f0f 70%, #2d0808 100%);",
    });
    return "seeded";
  },
});
