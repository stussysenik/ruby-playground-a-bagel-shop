import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Push a simulated order to the live ticker every 8 seconds
crons.interval(
  "simulated ticker",
  { seconds: 8 },
  api.liveTicker.pushSimulated,
);

// Slowly drain drop stock every 15 seconds
crons.interval(
  "drain drop stock",
  { seconds: 15 },
  api.drainStock.run,
);

export default crons;
