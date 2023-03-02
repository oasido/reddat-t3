import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

export const postsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          subreddit: true,
          author: true,
          PostVote: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextPost = posts.pop();
        nextCursor = nextPost!.id;
      }

      return { posts, nextCursor };
    }),

  getBySubreddit: publicProcedure
    .input(
      z.object({
        subredditName: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          subreddit: {
            name: input.subredditName,
          },
        },
        include: {
          subreddit: true,
          author: true,
          PostVote: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextPost = posts.pop();
        nextCursor = nextPost!.id;
      }

      return { posts, nextCursor };
    }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const response = ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          subreddit: true,
          author: true,
          PostVote: true,
          _count: {
            select: {
              comments: true,
            },
          },
          comments: {
            include: {
              author: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return response;
    }),

  newPost: protectedProcedure
    .input(
      z.object({
        subredditId: z.string(),
        title: z.string().min(3).max(300),
        content: z.string().max(40000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            subredditId: input.subredditId,
            authorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  newComment: protectedProcedure
    .input(
      z.object({
        content: z.string().max(10000).trim().min(2),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.comment.create({
          data: {
            content: input.content,
            postId: input.postId,
            authorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),

  vote: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        magnitude: z.number().gte(-1).lte(1).int(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId =
        ctx.session.user.id ?? new Error("Authentication failed, try again");
      const { postId, magnitude } = input;
      try {
        // First, handle the removal of any current votes.
        const maybeVote = await ctx.prisma.postVote.findUnique({
          where: { userId_postId: { userId, postId } },
        });

        if (maybeVote) {
          // There was an old vote. Remove it!
          const oldMagnitude = maybeVote.magnitude;
          await ctx.prisma.$transaction([
            ctx.prisma.postVote.delete({
              where: { userId_postId: { userId, postId } },
            }),
            ctx.prisma.post.update({
              where: { id: postId },
              data: {
                votesCount: { decrement: oldMagnitude },
                [oldMagnitude >= 0 ? "upvotesCount" : "downvotesCount"]: {
                  decrement: 1,
                },
              },
            }),
          ]);

          // User had an old vote, so just remove their vote and return.
          if (oldMagnitude === magnitude) {
            return;
          }
        }

        // If the user wants to remove their vote without any new vote, do that.
        if (!magnitude) {
          return;
        }

        // Add the new vote
        await ctx.prisma.$transaction([
          ctx.prisma.postVote.create({
            data: { userId, postId, magnitude },
          }),
          ctx.prisma.post.update({
            where: { id: postId },
            data: {
              votesCount: { increment: magnitude },
              [magnitude >= 0 ? "upvotesCount" : "downvotesCount"]: {
                increment: 1,
              },
            },
          }),
        ]);
      } catch (error) {
        console.error(error);
      }
    }),
});
