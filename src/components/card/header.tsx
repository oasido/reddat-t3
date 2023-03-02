import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  subreddit?: string;
  avatar?: string | null;
  author?: string;
  isLoading?: boolean;
  timeAgo: string;
};

const startsWithSlashR = (value: string): boolean => /^\/r\//.test(value);

export const Header = ({
  subreddit,
  avatar,
  author,
  timeAgo,
  isLoading,
}: HeaderProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 h-4 w-4 rounded-full">
        {avatar === undefined && (
          <div className="h-4 w-4 animate-pulse rounded-full bg-red-500" />
        )}
        {avatar !== undefined && (
          <Image
            src={
              avatar ??
              `https://api.dicebear.com/5.x/identicon/png?seed=${subreddit}`
            }
            width={64}
            height={64}
            alt={`r/${subreddit}'s avatar`}
            className={"h-full w-full rounded-full border-white p-2"}
            objectFit="cover"
          />
        )}
      </div>
      {isLoading ? (
        <div className="flex items-end gap-2">
          <div className="h-3 w-20 rounded-lg bg-neutral-300/10" />
          <div className="h-2.5 w-16 rounded-lg bg-neutral-300/10" />
        </div>
      ) : (
        <>
          <Link
            href={
              subreddit && startsWithSlashR(subreddit)
                ? subreddit
                : `/r/${subreddit}`
            }
          >
            <a className="text-xs font-[600] text-gray-50 hover:underline">
              r/{subreddit}
            </a>
          </Link>
          <a href="#" className="ml-3 text-xs text-gray-500">
            Posted by u/{author}
          </a>
          <a href="#" className="ml-3 text-xs text-gray-500">
            {timeAgo}
          </a>
        </>
      )}
    </div>
  );
};
