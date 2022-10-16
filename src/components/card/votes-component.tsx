import { BiUpvote, BiDownvote } from "react-icons/bi";
import { MouseEventHandler, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

type VotesProps = {
  // userId: string;
  postId: string;
  /** 1 if the user has upvoted this post, -1 if they've downvoted, else 0. */
  userMagnitude: -1 | 0 | 1;
  /** Number of (upvotes - downvotes) this Post has received so far. */
  votesCount: number;
};
export const VotesComponent = (props: VotesProps): JSX.Element => {
  const { postId, userMagnitude, votesCount } = props;

  const { data: sessionData } = useSession();

  const voteOnPost = trpc.posts.vote.useMutation();

  const [magnitude, setMagnitude] = useState(userMagnitude);

  const makeHandleClick =
    (newMagnitude: -1 | 0 | 1): MouseEventHandler =>
    async (event) => {
      event.preventDefault();

      setMagnitude(newMagnitude);
      console.log(votesCount - (magnitude - userMagnitude));

      await voteOnPost.mutateAsync({
        postId,
        magnitude: newMagnitude,
      });
    };

  useEffect(() => {
    setMagnitude(userMagnitude);
  }, [userMagnitude]);

  return (
    <div className="col-span-1 flex flex-col items-center justify-center bg-neutral-900/25 p-2 text-2xl ">
      <button className="radius rounded-full p-1.5 hover:bg-gray-200/10">
        <BiUpvote
          onClick={makeHandleClick(magnitude > 0 ? 0 : 1)}
          className={magnitude > 0 ? "text-red-500" : "text-neutral-500"}
        />
      </button>
      <span className="text-center text-base font-[600] text-gray-200">
        {votesCount + (magnitude - userMagnitude)}
      </span>
      <button className="radius rounded-full p-1.5 hover:bg-gray-200/10">
        <BiDownvote
          onClick={makeHandleClick(magnitude < 0 ? 0 : -1)}
          className={magnitude < 0 ? "text-red-500" : "text-neutral-500"}
        />
      </button>
    </div>
  );
};
