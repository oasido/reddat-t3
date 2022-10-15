import { BiDownvote, BiUpvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { TitleAndBody } from "./title-and-body";
import { Footer } from "./footer";
import { Header } from "./header";
import { VotesComponent } from "./votes-component";

type CardProps = {
  subreddit: string;
  title: string;
  votes: number;
  postedBy: string;
  body: string;
  comments?: number;
};

export const Card = ({
  title,
  votes,
  postedBy,
  body,
  subreddit,
}: CardProps): JSX.Element => {
  return (
    <div className="mb-2.5 grid grid-cols-12 rounded-md border border-transparent bg-neutral-800 hover:border-neutral-500">
      <VotesComponent votes={votes} />
      <div className="space-between col-span-11 flex flex-col">
        <div className="p-2">
          <Header subreddit={subreddit} postedBy={postedBy} />
          <TitleAndBody title={title} body={body} />
        </div>
        <Footer label="Comments" icon={<GoComment />} />
      </div>
    </div>
  );
};
