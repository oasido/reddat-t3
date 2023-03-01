import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";
/* import { getServerAuthSession } from "./../../../../server/common/get-server-auth-session"; */

export const subredditRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subreddit.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
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
      if (!input.userId) return null;
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
        name: z
          .string()
          .min(2)
          .max(20)
          .regex(/^[a-zA-Z0-9]*$/, {
            message:
              "Use only English letters and numbers, no whitespaces or special characters allowed.",
          }),
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

        const newSubreddit = await ctx.prisma.subreddit.create({
          data: {
            name: input.name,
            SubredditModerator: {
              create: {
                userId: ctx.session.user.id,
              },
            },
            description: input.description,
            avatar: input.image,
          },
        });

        await ctx.prisma.subredditSubscription.create({
          data: {
            subredditId: newSubreddit.id,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  getTop: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subreddit.findMany({
      select: {
        id: true,
        title: true,
        name: true,
        description: true,
      },
      orderBy: {
        users: {
          _count: "desc",
        },
      },
      take: 5,
    });
  }),

  changeCoverImage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        subredditId: z.string(),
        source: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // add a better way to authenticate admins
        const isModerator = await ctx.prisma.subredditModerator.findFirst({
          where: {
            subredditId: input.subredditId,
            userId: input.userId,
          },
        });

        console.log("isModerator", isModerator);

        isModerator &&
          (await ctx.prisma.subreddit.update({
            data: {
              cover: input.source,
            },
            where: {
              id: input.subredditId,
            },
          }));

        !isModerator && new Error("Not a moderator");
      } catch (error) {
        console.log("error", error);
      }
    }),
});
