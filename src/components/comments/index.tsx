import { Post, User, PostVote, Subreddit, Comment } from "@prisma/client";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SingleComment } from "./single-comment";
import { useState } from "react";

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
  const [isInputActive, setIsInputActive] = useState(false);

  dayjs.extend(relativeTime);

  return (
    <Link href={`/r/${subreddit?.name}/${id}`}>
      <div className="-mt-1 rounded-md border border-neutral-700 bg-neutral-800">
        <div className="border-b-2 border-b-neutral-600/60">
          <h3 className="m-2 font-bold text-white">Comments:</h3>
          <div className="flex justify-center">
            <textarea
              placeholder="What are your thoughts?"
              onClick={() => setIsInputActive(true)}
              className={`${
                isInputActive ? "h-20" : "h-10"
              } mx-2 mb-2 max-h-20 w-full resize-none rounded-md bg-neutral-700 p-2 text-white duration-75 ease-in`}
            ></textarea>
          </div>
          <div
            className={`${
              isInputActive
                ? "my-2 mr-2 flex items-center justify-end gap-2"
                : "hidden"
            } easy-in duration-75 `}
          >
            <button
              onClick={() => setIsInputActive(false)}
              className="rounded-md bg-red-700 px-2 py-1 font-bold text-white hover:bg-red-600 "
            >
              Cancel
            </button>
            <button className="rounded-md bg-sky-700 px-2 py-1 font-bold text-white hover:bg-sky-600 ">
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
        </div>
      </div>
    </Link>
  );
};
