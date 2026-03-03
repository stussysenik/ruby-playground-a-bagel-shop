import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const seedAll = action({
  args: {},
  handler: async (ctx) => {
    const results = {
      menuItems: await ctx.runMutation(api.menuItems.seed),
      testimonials: await ctx.runMutation(api.testimonials.seed),
      drops: await ctx.runMutation(api.drops.seed),
    };
    return results;
  },
});
