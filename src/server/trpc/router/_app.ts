// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./subrouters/example";
import { postsRouter } from "./subrouters/posts";
import { subredditRouter } from "./subrouters/subreddit";

export const appRouter = router({
  example: exampleRouter,
  posts: postsRouter,
  subreddit: subredditRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
