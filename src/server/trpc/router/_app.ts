// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
