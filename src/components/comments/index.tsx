import { Post, User, PostVote, Subreddit, Comment } from "@prisma/client";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SingleComment } from "./single-comment";

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

export const Comments = ({ post, isLoading }: CommentsProps): JSX.Element => {
  const { id, subreddit } = post ?? {};

  dayjs.extend(relativeTime);

  return (
    <Link href={`/r/${subreddit?.name}/${id}`}>
      <div className="-mt-1 rounded-md border border-neutral-700 bg-neutral-800">
        <div className="border-b-2 border-b-neutral-600/60">
          <h3 className="m-2 font-bold text-white">Comments:</h3>
          <div className="flex justify-center">
            <textarea
              placeholder="What are your thoughts?"
              className="mx-2 mb-3 max-h-14 w-full rounded-md bg-neutral-700 p-2 text-white"
            ></textarea>
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
