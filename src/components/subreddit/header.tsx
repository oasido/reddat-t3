import { Subreddit, SubredditModerator } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { CoverImage } from "./cover-image";
import { useSession } from "next-auth/react";
import { useState } from "react";

type SubredditHeaderProps = {
  slug: string;
  subreddit?: Subreddit & {
    moderators: SubredditModerator[];
  };
  isAdmin?: boolean;
  isSubscribed?: boolean;
};

export const SubredditHeader = ({
  slug,
  subreddit,
  isAdmin,
  isSubscribed,
}: SubredditHeaderProps): JSX.Element => {
  const { data: sessionData } = useSession();


  const [subscribe, setSubscribe] = useState(isSubscribed);

  const joinSub = trpc.subreddit.join.useMutation();
  const ctx = trpc.useContext();

  const handleJoinButton = async () => {
    setSubscribe(!subscribe);
    await joinSub.mutateAsync(
      {
        subredditId: subreddit?.id ?? "",
        userId: sessionData?.user?.id ?? "",
      },
      {
        onSuccess: () => {
          ctx.subreddit.invalidate();
        },
      }
    );
  };

  return (
    <div className="relative h-56 bg-neutral-800">
      <CoverImage subredditMods={subreddit?.moderators} />
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end">
          <div className="mr-3 h-16 w-16 rounded-full border-4 border-white bg-orange-500" />
          <div>
            <div className="flex items-end">
              <h2 className="text-2xl font-bold text-gray-200">
                {subreddit?.title ?? slug}
              </h2>
              <button
                onClick={handleJoinButton}
                className="ml-4 rounded-xl border-2 bg-gray-300 px-3 py-0.5 text-sm font-[600] hover:bg-gray-100"
              >
                {subscribe ? "Joined" : "Join"}
              </button>
              {isAdmin && (
                <span
                  title="Click to moderate this subreddit"
                  className="mx-2 cursor-pointer select-none text-sm text-gray-400 underline hover:text-gray-300"
                >
                  Manage
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">
              r/{subreddit?.name ?? slug}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
