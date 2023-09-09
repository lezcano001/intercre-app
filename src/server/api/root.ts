import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { participantsRouter } from "./routers/participants";
import { institutionsRouter } from "./routers/institutions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  participants: participantsRouter,
  institutions: institutionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
