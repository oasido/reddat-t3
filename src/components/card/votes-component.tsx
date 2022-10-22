import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { MouseEventHandler, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

type VotesProps = {
  postId?: string;

  /** 1 if the user has upvoted this post, -1 if they've downvoted, else 0. */
  userMagnitude?: -1 | 0 | 1;

  votesCount?: number;
  isLoading?: boolean;
};
export const VotesComponent = (props: VotesProps): JSX.Element => {
  const { postId, userMagnitude, votesCount } = props;

  const voteOnPost = trpc.posts.vote.useMutation();

  const [magnitude, setMagnitude] = useState(userMagnitude);

  const makeHandleClick =
    (newMagnitude: -1 | 0 | 1): MouseEventHandler =>
    async (event) => {
      event.preventDefault();

      setMagnitude(newMagnitude);

      await voteOnPost.mutateAsync({
        postId: postId ?? "",
        magnitude: newMagnitude,
      });
    };

  useEffect(() => {
    setMagnitude(userMagnitude);
  }, [userMagnitude]);

  if (
    typeof magnitude === "undefined" ||
    typeof votesCount === "undefined" ||
    typeof userMagnitude === "undefined"
  ) {
    return (
      <div className="col-span-1 flex flex-col items-center justify-center bg-neutral-900/25 p-2 text-2xl ">
        <span className="text-center text-base font-[600] text-gray-200">
          <div className="mt-1 h-5 w-5 rounded-lg bg-neutral-400/20 text-xl font-bold" />
        </span>
      </div>
    );
  }

  return (
    <div className="col-span-1 flex flex-col items-center justify-center bg-neutral-900/25 p-2 text-2xl ">
      <button
        onClick={makeHandleClick(magnitude > 0 ? 0 : 1)}
        className="rounded-full p-1.5 hover:bg-gray-200/10"
      >
        <ChevronUpIcon
          className={`h-6 w-6 ${
            magnitude > 0 ? "text-red-500" : "text-neutral-500"
          }`}
        />
      </button>
      <span className="text-center text-base font-[600] text-gray-200">
        {votesCount + (magnitude - userMagnitude)}
      </span>
      <button
        onClick={makeHandleClick(magnitude < 0 ? 0 : -1)}
        className="rounded-full p-1.5 hover:bg-gray-200/10"
      >
        <ChevronDownIcon
          className={`h-6 w-6 ${
            magnitude < 0 ? "text-red-500" : "text-neutral-500"
          }`}
        />
      </button>
    </div>
  );
};
