import { createTRPCRouter } from "~/server/api/trpc";
import { participantsRouter } from "./routers/participants";
import { institutionsRouter } from "./routers/institutions";
import { disciplinesRouter } from "./routers/disciplines";
import { squadsRouter } from "./routers/squads";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  participants: participantsRouter,
  institutions: institutionsRouter,
  disciplines: disciplinesRouter,
  squads: squadsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
