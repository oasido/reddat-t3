import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const subredditRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subreddit.findMany();
  }),

  new: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.subreddit.create({
          data: {
            name: input.name,
            description: input.description,
            image: input.image,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
