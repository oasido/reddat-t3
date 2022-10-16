import { BiDownvote, BiUpvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { TitleAndBody } from "./title-and-body";
import { Footer } from "./footer";
import { Header } from "./header";
import { VotesComponent } from "./votes-component";
import { Post, User, PostVote, Subreddit } from "@prisma/client";

type PostCardProps = {
  post: Post & {
    PostVote: PostVote[];
    subreddit: Subreddit;
    author: User;
  };
};

export const Card = ({ post }: PostCardProps): JSX.Element => {
  const { id, author, votesCount, title, content, subreddit, PostVote } = post;
  const userMagnitude = (PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1;

  return (
    <div className="mb-2.5 grid grid-cols-12 rounded-md border border-transparent bg-neutral-800 hover:border-neutral-500">
      <VotesComponent
        postId={id}
        votesCount={votesCount}
        userMagnitude={userMagnitude}
      />
      <div className="space-between col-span-11 flex flex-col">
        <div className="p-2">
          <Header
            subreddit={subreddit?.name}
            author={`u/${author?.name ?? author.id}`}
          />
          <TitleAndBody title={title} content={content ?? ""} />
        </div>
        <Footer label="Comments" icon={<GoComment />} />
      </div>
    </div>
  );
};
