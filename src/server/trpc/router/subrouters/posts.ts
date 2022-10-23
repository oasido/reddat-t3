import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const postsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        subreddit: true,
        author: true,
        PostVote: true,
      },
    });
  }),

  getBySubreddit: publicProcedure
    .input(
      z.object({
        subredditName: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          subreddit: {
            name: input.subredditName,
          },
        },
        include: {
          subreddit: true,
          author: true,
          PostVote: true,
        },
      });
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
          comments: {
            include: {
              author: true,
            },
          },
        },
      });

      return response;
    }),

  postComment: protectedProcedure
    .input(
      z.object({
        content: z.string().max(150).trim().min(2),
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
            subredditId: "cl9bfmp0k0000utl9nnh9fq1y",
            authorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error", error);
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
