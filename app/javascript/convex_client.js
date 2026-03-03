import { ConvexClient } from "convex/browser";

let client = null;

export function getConvexClient() {
  if (client) return client;

  const url = document.querySelector('meta[name="convex-url"]')?.content;
  if (!url) {
    console.warn("Convex URL not configured — running in offline mode");
    return null;
  }

  client = new ConvexClient(url);
  return client;
}

export function convexQuery(client, queryName, args = {}) {
  if (!client) return Promise.resolve(null);
  return client.query(queryName, args);
}

export function convexMutation(client, mutationName, args = {}) {
  if (!client) return Promise.resolve(null);
  return client.mutation(mutationName, args);
}
