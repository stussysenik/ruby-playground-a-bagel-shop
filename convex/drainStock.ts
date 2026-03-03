import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const run = action({
  args: {},
  handler: async (ctx) => {
    const drop = await ctx.runQuery(api.drops.getActiveDrop);
    if (drop && drop.remainingStock > 12) {
      await ctx.runMutation(api.drops.decrementStock, { dropId: drop._id });
    }
  },
});
