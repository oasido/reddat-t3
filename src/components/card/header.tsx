type HeaderProps = {
  subreddit: string;
  postedBy: string;
};

export const Header = ({ subreddit, postedBy }: HeaderProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 h-4 w-4 rounded-full bg-blue-400" />
      <a href="#" className="text-xs font-[600] text-gray-50">
        {subreddit}
      </a>
      <a href="#" className="ml-3 text-xs text-gray-500">
        Posted by {postedBy}
      </a>
    </div>
  );
};
