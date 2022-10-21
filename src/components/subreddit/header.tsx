import { Subreddit, SubredditModerator } from "@prisma/client";

type SubredditHeaderProps = {
  slug: string;
  subreddit?: Subreddit & {
    moderators: SubredditModerator[];
  };
  isAdmin: boolean;
};

export const SubredditHeader = ({
  slug,
  subreddit,
  isAdmin,
}: SubredditHeaderProps): JSX.Element => {
  return (
    <div className="relative h-52 bg-neutral-800">
      <div className="h-32 bg-red-500 align-baseline" />
      <div className="absolute left-6 bottom-6">
        <div className="flex items-end">
          <div className="mr-3 h-16 w-16 rounded-full border-4 border-white bg-orange-500" />
          <div>
            <div className="flex items-end">
              <h2 className="text-2xl font-bold text-white">
                {subreddit?.title ?? slug}
              </h2>
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
