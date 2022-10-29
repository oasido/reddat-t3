import { Post, User, PostVote, Subreddit, Comment } from "@prisma/client";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SingleComment } from "./single-comment";
import { useState } from "react";
import { z, ZodError } from "zod";
import { trpc } from "../../utils/trpc";

type CommentsProps = {
  post?: Post & {
    author: User;
    subreddit: Subreddit;
    comments: (Comment & {
      author: User;
    })[];
    PostVote: PostVote[];
  };
  isLoading?: boolean;
};

export const Comments = ({ post }: CommentsProps): JSX.Element => {
  const { id, subreddit } = post ?? {};
  const [isCommentInputActive, setIsCommentInputActive] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentInputErrors, setCommentInputErrors] = useState<
    ZodError | TypeError
  >();
  dayjs.extend(relativeTime);

  const commentSchema = z.string().max(150).trim().min(2);

  const ctx = trpc.useContext();
  const comment = trpc.posts.newComment.useMutation();

  const postComment = () => {
    try {
      const parsedComment = commentSchema.parse(commentInput);
      setCommentInputErrors(undefined);

      if (typeof id === "string") {
        comment.mutateAsync(
          {
            content: parsedComment,
            postId: id,
          },
          {
            onSuccess: () => {
              ctx.posts.invalidate();
              setCommentInput("");
              setIsCommentInputActive(false);
            },
            onError: (error) => console.log(error),
          }
        );
      } else {
        throw new TypeError("There was a problem accessing the main post ID");
      }
    } catch (error) {
      console.log(error);
      error instanceof ZodError && setCommentInputErrors(error);
      error instanceof TypeError && setCommentInputErrors(error);
    }
  };

  return (
    <Link href={`/r/${subreddit?.name}/${id}`}>
      <div className="-mt-1 rounded-md border border-neutral-700 bg-neutral-800">
        <div className="border-b-2 border-b-neutral-600/60">
          <div className="flex justify-center">
            <textarea
              placeholder="What are your thoughts?"
              onClick={() => setIsCommentInputActive(true)}
              value={commentInput}
              onChange={(evt) => {
                setCommentInput(evt.target.value);
                // setCommentInputErrors(undefined);
              }}
              className={`${
                isCommentInputActive ? "h-20" : "h-11"
              } m-2 max-h-20 w-full resize-none rounded-md border-2 bg-neutral-700 p-2 text-white outline-0 duration-75 ease-in
              ${
                commentInputErrors
                  ? "border-2 border-red-600"
                  : "border-transparent"
              }`}
            />
          </div>
          <div
            className={`${
              isCommentInputActive
                ? "mx-2 mb-2 flex items-center justify-end gap-2"
                : "hidden"
            } easy-in duration-75`}
          >
            {commentInputErrors instanceof ZodError &&
              commentInputErrors.errors.map((error, idx) => (
                <p key={idx} className="text-sm font-[600] text-red-500">
                  {error.message}
                </p>
              ))}
            {commentInputErrors instanceof TypeError && (
              <p className="text-sm font-[600] text-red-500">
                {commentInputErrors.message}
              </p>
            )}
            <button
              onClick={() => {
                setIsCommentInputActive(false);
                setCommentInputErrors(undefined);
              }}
              className="rounded-md bg-red-700 px-2 py-1 font-bold text-white hover:bg-red-600 "
            >
              Cancel
            </button>
            <button
              onClick={() => postComment()}
              className="rounded-md bg-sky-700 px-2 py-1 font-bold text-white hover:bg-sky-600 "
            >
              Post
            </button>
          </div>
        </div>

        <div className="space-between flex flex-col divide-y-2 divide-neutral-400/10">
          {post &&
            post.comments.map((comment, idx) => (
              <SingleComment
                key={idx}
                author={comment.author}
                comment={comment}
              />
            ))}
          {post && post.comments.length === 0 && (
            <h3 className="my-7 text-center text-gray-400">No comments.</h3>
          )}
        </div>
      </div>
    </Link>
  );
};
