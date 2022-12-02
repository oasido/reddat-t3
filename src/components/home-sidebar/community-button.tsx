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
  return isLoading ? (
    <div className="mx-2 rounded-xl border-2 bg-transparent px-3 py-0.5 hover:bg-gray-500/10" />
  ) : (
    <Link href={`/r/${name}`}>
      <button className="mx-2 rounded-xl border-2 bg-transparent px-3 py-0.5 text-sm font-[600] text-gray-300 hover:bg-gray-500/10">
        {title ?? name}
      </button>
    </Link>
  );
};
