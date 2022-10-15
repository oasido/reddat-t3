import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        subreddit: true,
        author: true,
      },
    });
  }),

  new: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            subredditId: "cl9advixt0000ut9pvddboho7",
            authorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
