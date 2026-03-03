import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("menu_items").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("menu_items").first();
    if (existing) return "already seeded";

    const items = [
      {
        itemId: "classic",
        label: "Signature",
        name: "The Classic",
        desc: "Plain perfection. 36-hour ferment, cherry-wood fired. The one that started it all.",
        price: 6,
        locked: false,
        unlockThreshold: 0,
        bagelStyle: "",
        emoji: "\u{1FAD3}",
      },
      {
        itemId: "everything",
        label: "Bestseller",
        name: "The Everything",
        desc: "Sesame, poppy, garlic, onion, salt. Hand-applied. Architecturally distributed.",
        price: 7,
        locked: false,
        unlockThreshold: 0,
        bagelStyle: "",
        emoji: "\u{1F36A}",
      },
      {
        itemId: "sesame",
        label: "Cult Favorite",
        name: "Sesame Gold",
        desc: "Toasted black & white sesame. Finished with Maldon salt and aged miso butter.",
        price: 8,
        locked: false,
        unlockThreshold: 0,
        bagelStyle:
          "background: radial-gradient(circle at 40% 35%, #f0d88a 0%, #dbb668 20%, #c8a257 45%, #a07830 70%, #7a5a20 100%);",
        emoji: "\u{1F95E}",
      },
      {
        itemId: "zaatar",
        label: "Secret Menu",
        name: "Za'atar Sunrise",
        desc: "Wild thyme za'atar blend, sumac-pickled onion, labneh schmear. Mediterranean dawn.",
        price: 9,
        locked: true,
        unlockThreshold: 4,
        bagelStyle:
          "background: radial-gradient(circle at 40% 35%, #e8d5a8 0%, #b8943a 20%, #6b7a3a 45%, #4a5a28 70%, #3a4520 100%);",
        emoji: "\u2600",
      },
      {
        itemId: "truffle",
        label: "Secret Menu",
        name: "Black Truffle",
        desc: "Shaved Périgord truffle. Gruyère. Truffle honey. The $22 bagel people fly for.",
        price: 22,
        locked: true,
        unlockThreshold: 4,
        bagelStyle:
          "background: radial-gradient(circle at 40% 35%, #d4c4a8 0%, #8a7a6a 20%, #4a4040 45%, #2a2020 70%, #1a1010 100%);",
        emoji: "\u{1F48E}",
      },
      {
        itemId: "matcha",
        label: "Secret Menu",
        name: "Matcha Ceremony",
        desc: "Ceremonial-grade Uji matcha dough. White chocolate. Yuzu cream cheese. Transcendent.",
        price: 14,
        locked: true,
        unlockThreshold: 6,
        bagelStyle:
          "background: radial-gradient(circle at 40% 35%, #d5e8c0 0%, #9ab86a 20%, #6a8a3a 45%, #4a6a28 70%, #3a5020 100%);",
        emoji: "\u{1F375}",
      },
    ];

    for (const item of items) {
      await ctx.db.insert("menu_items", item);
    }
    return "seeded";
  },
});
