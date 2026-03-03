import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_order")
      .collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("testimonials").first();
    if (existing) return "already seeded";

    const items = [
      {
        quote:
          "I've eaten bagels in 47 countries. Ruby ruined all of them for me. Nothing else comes close.",
        author: "David Chang",
        handle: "@davidchang",
        avatar: "DC",
        stars: 5,
        order: 0,
      },
      {
        quote:
          "We tried to reverse-engineer the recipe. After 6 months and $200K in R&D, we gave up and just placed a standing order.",
        author: "Emily Zhang",
        handle: "CEO, CloudKitchen",
        avatar: "EZ",
        stars: 5,
        order: 1,
      },
      {
        quote:
          "The crust-to-crumb ratio violates the laws of physics. I don't understand how a bagel can be this structurally perfect.",
        author: "Marcus Reeve",
        handle: "@breadscientist",
        avatar: "MR",
        stars: 5,
        order: 2,
      },
      {
        quote:
          "My Ruby subscription is more important to me than my Netflix subscription. I'm not joking.",
        author: "Sarah Kim",
        handle: "@sarahk",
        avatar: "SK",
        stars: 5,
        order: 3,
      },
      {
        quote:
          "I proposed to my wife with a Ruby bagel. She said yes before I could even ask. She thought I was proposing the bagel.",
        author: "Tom H.",
        handle: "@tomhartley",
        avatar: "TH",
        stars: 5,
        order: 4,
      },
      {
        quote:
          "We serve these at our Michelin restaurant. Guests have asked us to stop making our own bread entirely.",
        author: "Chef Ramsay L.",
        handle: "@chefRL",
        avatar: "RL",
        stars: 5,
        order: 5,
      },
      {
        quote:
          "I flew from Tokyo to New York, ate one bagel, turned around and flew home. Worth every minute.",
        author: "Yuki Tanaka",
        handle: "@yukitanaka",
        avatar: "YT",
        stars: 5,
        order: 6,
      },
      {
        quote:
          "Year 2 of my Ruby subscription. I've tried canceling once. Called back 4 hours later in a cold sweat.",
        author: "Jamie P.",
        handle: "@jamiep_eats",
        avatar: "JP",
        stars: 5,
        order: 7,
      },
    ];

    for (const item of items) {
      await ctx.db.insert("testimonials", item);
    }
    return "seeded";
  },
});
