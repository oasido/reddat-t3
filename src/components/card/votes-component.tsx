import { BiUpvote, BiDownvote } from "react-icons/bi";

type VotesProps = {
  votes: number;
};

export const VotesComponent = ({ votes }: VotesProps): JSX.Element => {
  return (
    <div className="col-span-1 flex flex-col items-center justify-center bg-neutral-900/25 p-2 text-2xl ">
      <button className="radius rounded-full p-1.5 hover:bg-gray-200/10">
        <BiUpvote className="text-neutral-500" />
      </button>
      <span className="text-center text-base font-[600] text-gray-200">
        {votes}
      </span>
      <button className="radius rounded-full p-1.5 hover:bg-gray-200/10">
        <BiDownvote className="text-neutral-500" />
      </button>
    </div>
  );
};
