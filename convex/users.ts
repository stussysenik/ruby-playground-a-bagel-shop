import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const ensureProfile = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Update streak
      const today = new Date().toDateString();
      const lastVisit = existing.lastVisit;
      let streak = existing.streak;

      if (lastVisit !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        streak = lastVisit === yesterday ? streak + 1 : 1;
        await ctx.db.patch(existing._id, { streak, lastVisit: today });
      }

      return existing._id;
    }

    return await ctx.db.insert("user_profiles", {
      userId,
      xp: 0,
      level: 1,
      achievements: [],
      passportStamps: ["classic", "everything", "sesame"],
      streak: 1,
      lastVisit: new Date().toDateString(),
      cartItems: [],
      sectionsVisited: [],
    });
  },
});

export const addXP = mutation({
  args: { userId: v.string(), amount: v.number() },
  handler: async (ctx, { userId, amount }) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return;

    const newXp = profile.xp + amount;
    const xpToNext = 100;
    const newLevel = Math.floor(newXp / xpToNext) + 1;

    await ctx.db.patch(profile._id, { xp: newXp, level: newLevel });
  },
});

export const unlockAchievement = mutation({
  args: { userId: v.string(), achievement: v.string() },
  handler: async (ctx, { userId, achievement }) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return false;

    if (profile.achievements.includes(achievement)) return false;

    await ctx.db.patch(profile._id, {
      achievements: [...profile.achievements, achievement],
    });
    return true;
  },
});

export const visitSection = mutation({
  args: { userId: v.string(), section: v.string() },
  handler: async (ctx, { userId, section }) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return;

    if (!profile.sectionsVisited.includes(section)) {
      await ctx.db.patch(profile._id, {
        sectionsVisited: [...profile.sectionsVisited, section],
      });
    }
  },
});

export const collectStamp = mutation({
  args: { userId: v.string(), stampId: v.string() },
  handler: async (ctx, { userId, stampId }) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return;

    if (!profile.passportStamps.includes(stampId)) {
      await ctx.db.patch(profile._id, {
        passportStamps: [...profile.passportStamps, stampId],
      });
    }
  },
});

export const addToCart = mutation({
  args: {
    userId: v.string(),
    item: v.object({ name: v.string(), price: v.number() }),
  },
  handler: async (ctx, { userId, item }) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return;

    await ctx.db.patch(profile._id, {
      cartItems: [...profile.cartItems, item],
    });
  },
});
