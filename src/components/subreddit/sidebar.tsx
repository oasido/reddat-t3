import { Subreddit, SubredditModerator } from "@prisma/client";
import dayjs from "dayjs";
import { CakeIcon } from "@heroicons/react/20/solid";

type SidebarProps = {
  subreddit?: Subreddit & {
    moderators: SubredditModerator[];
    _count: {
      users: number;
    };
  };
  slug: string;
};

export const Sidebar = ({ subreddit }: SidebarProps): JSX.Element => {
  return (
    <div className="mb-2.5 rounded-md border border-neutral-700 bg-neutral-800">
      <div className="space-between flex flex-col">
        <div className="p-2">
          <h4 className="mb-3 text-xs font-bold text-gray-500">
            About Community
          </h4>
          <p className="text-sm text-gray-200">
            {subreddit?.description ??
              "The moderators haven't provided any description to this sub, yet!"}
          </p>

          <div className="my-3 flex items-end gap-2">
            <CakeIcon className="h-4 w-4 text-xl text-gray-200" />
            <p className="text-sm text-gray-400">
              {dayjs(subreddit?.createdAt).format("[Created] MMM D, YYYY") ??
                "Cake day not available"}
            </p>
          </div>

          <div className="flex flex-col border-y border-gray-400/20 py-2">
            <h4 className="text-sm text-gray-100">
              {subreddit?._count.users ?? 0}
            </h4>
            <span className="text-xs text-gray-400">Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};
