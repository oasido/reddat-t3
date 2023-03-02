import { Subreddit, SubredditModerator } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { CoverImage } from "./cover-image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SubredditHeaderProps = {
  slug: string;
  subreddit?: Subreddit & {
    SubredditModerator: SubredditModerator[];
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

  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const [subscribe, setSubscribe] = useState(isSubscribed);

  useEffect(() => {
    setSubscribe(isSubscribed);
  }, [isSubscribed]);

  const joinSub = trpc.subreddit.join.useMutation();
  const ctx = trpc.useContext();

  const handleJoinButton = async () => {
    setIsOnCooldown(true);
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
        onError: (error) => {
          console.log("There was an error: ", error);
        },
      }
    );
    setTimeout(() => {
      setIsOnCooldown(false);
    }, 1000);
  };

  if (!subreddit) {
    return <p>Loading</p>;
  }

  return (
    <div className="relative h-56 bg-neutral-800">
      <CoverImage
        subredditMods={subreddit?.SubredditModerator ?? []}
        subredditCoverImage={subreddit?.cover ?? null}
        subredditId={subreddit?.id ?? ""}
      />
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end">
          <div className="m-1 hidden h-16 w-16 xs:block">
            <Image
              src={
                subreddit.avatar ??
                `https://api.dicebear.com/5.x/identicon/png?seed=${subreddit.name}`
              }
              width={64}
              height={64}
              alt={`r/${subreddit.name}'s avatar`}
              className={"h-full w-full rounded-full border-white p-2"}
              objectFit="cover"
            />
          </div>
          <div>
            <div className="flex items-end">
              <h2 className="text-2xl font-bold text-gray-200">
                <Link href={`/r/${subreddit.name}`}>
                  {subreddit?.title ?? slug}
                </Link>
              </h2>
              {sessionData && (
                <button
                  onClick={handleJoinButton}
                  className={`ml-4 rounded-xl px-3 py-1 text-sm font-[600]  ${
                    isOnCooldown
                      ? "cursor-wait bg-gray-400"
                      : "cursor-pointer bg-gray-400 hover:bg-gray-100"
                  }`}
                  disabled={isOnCooldown ? true : false}
                >
                  {subscribe ? "Joined" : "Join"}
                </button>
              )}
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
