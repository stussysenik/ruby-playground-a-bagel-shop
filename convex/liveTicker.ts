import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("live_ticker")
      .withIndex("by_timestamp")
      .order("desc")
      .first();
  },
});

export const pushEvent = mutation({
  args: {
    customerName: v.string(),
    item: v.string(),
    location: v.string(),
    isSimulated: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Keep only last 50 ticker events
    const oldEvents = await ctx.db
      .query("live_ticker")
      .withIndex("by_timestamp")
      .order("asc")
      .take(50);

    if (oldEvents.length >= 50) {
      // Remove oldest events beyond 50
      const toDelete = oldEvents.slice(0, oldEvents.length - 49);
      for (const event of toDelete) {
        await ctx.db.delete(event._id);
      }
    }

    return await ctx.db.insert("live_ticker", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

const simulatedOrders = [
  { name: "Sarah M.", item: "6 Everything Bagels", loc: "Brooklyn, NY" },
  { name: "Kenji T.", item: "Ruby Red Velvet x2", loc: "Tokyo, JP" },
  { name: "Fatima A.", item: "12 Classic Bagels", loc: "Dubai, UAE" },
  { name: "Lars B.", item: "Truffle Bagel Pack", loc: "Stockholm, SE" },
  { name: "Maria C.", item: "Sesame Gold x4", loc: "São Paulo, BR" },
  { name: "James W.", item: "Everything + Cream Cheese", loc: "London, UK" },
  { name: "Priya S.", item: "Matcha Ceremony x3", loc: "Mumbai, IN" },
  { name: "Chen L.", item: "24 Mixed Bagels", loc: "Shanghai, CN" },
  { name: "Emma R.", item: "Za'atar Sunrise x6", loc: "Paris, FR" },
  { name: "David K.", item: "Full Passport Pack", loc: "Seoul, KR" },
  { name: "Sofia V.", item: "Ruby Red Velvet", loc: "Mexico City, MX" },
  { name: "Olga P.", item: "12 Everything Bagels", loc: "Berlin, DE" },
];

export const pushSimulated = action({
  args: {},
  handler: async (ctx) => {
    const order =
      simulatedOrders[Math.floor(Math.random() * simulatedOrders.length)];

    await ctx.runMutation(api.liveTicker.pushEvent, {
      customerName: order.name,
      item: order.item,
      location: order.loc,
      isSimulated: true,
    });
  },
});
