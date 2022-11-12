import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const subredditRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subreddit.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  }),

  getOne: publicProcedure
    .input(z.object({ subredditName: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subreddit.findUnique({
        where: {
          name: input.subredditName,
        },
        include: {
          SubredditModerator: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      });
    }),

  getUserSubscriptions: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          subreddits: true,
        },
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        subredditId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isAlreadyJoined =
          await ctx.prisma.subredditSubscription.findUnique({
            where: {
              subredditId_userId: {
                subredditId: input.subredditId,
                userId: input.userId,
              },
            },
          });

        if (isAlreadyJoined) {
          return await ctx.prisma.subredditSubscription.delete({
            where: {
              subredditId_userId: {
                subredditId: input.subredditId,
                userId: input.userId,
              },
            },
          });
        } else {
          return await ctx.prisma.subredditSubscription.create({
            data: {
              subredditId: input.subredditId,
              userId: input.userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }),

  new: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(20),
        description: z.string().max(100).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isFound = await ctx.prisma.subreddit.findFirst({
          where: {
            name: input.name,
          },
        });

        if (isFound) {
          return { error: true, msg: "Subreddit already exists" };
        }

        if (typeof ctx.session.user.id !== "string") {
          return { error: true, msg: "User not found" };
        }

        await ctx.prisma.subreddit.create({
          data: {
            name: input.name,
            SubredditModerator: {
              create: {
                userId: ctx.session.user.id,
              },
            },
            description: input.description,
            image: input.image,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  getList: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subreddit.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }),
});
