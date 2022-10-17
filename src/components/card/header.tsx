import Link from "next/link";

type HeaderProps = {
  subreddit: string;
  author: string;
};

export const Header = ({ subreddit, author }: HeaderProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 h-4 w-4 rounded-full bg-blue-400" />
      <Link href={subreddit}>
        <a className="text-xs font-[600] text-gray-50">{subreddit}</a>
      </Link>
      <a href="#" className="ml-3 text-xs text-gray-500">
        Posted by {author}
      </a>
    </div>
  );
};
