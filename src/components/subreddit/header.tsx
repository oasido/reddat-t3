type SubredditHeaderProps = {
  subreddit: string;
};

export const SubredditHeader = ({
  subreddit,
}: SubredditHeaderProps): JSX.Element => {
  console.log(subreddit);
  return (
    <div className="relative h-52 bg-neutral-800">
      <div className="h-32 bg-red-500 align-baseline" />
      <div className="absolute left-6 bottom-6">
        <div className="flex items-end">
          <div className="mr-3 h-16 w-16 rounded-full border-4 border-white bg-orange-500" />
          <div>
            <h2 className="text-3xl font-[600] text-white">{subreddit}</h2>
            <span className="text-sm text-gray-400">r/{subreddit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
