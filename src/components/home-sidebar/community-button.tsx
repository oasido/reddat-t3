import Link from "next/link";

type CommunityButtonProps = {
  isLoading: boolean;
  title?: string | null;
  name?: string;
};

export const CommunityButton = ({
  isLoading,
  title,
  name,
}: CommunityButtonProps) => {
  if (isLoading === true) {
    return (
      <div className="mx-2 h-5 animate-pulse rounded-xl bg-gray-300 px-3 py-0.5 dark:bg-gray-400" />
    );
  } else {
    return (
      <Link href={`/r/${name}`}>
        <button className="mx-2 rounded-xl border-2 bg-transparent px-3 py-0.5 text-sm font-[600] text-gray-300 hover:bg-gray-500/10">
          {title ?? name}
        </button>
      </Link>
    );
  }
};
