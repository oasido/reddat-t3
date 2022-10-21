import { ChatBubbleBottomCenterIcon } from "@heroicons/react/20/solid";
import { TitleAndBody } from "./title-and-body";
import { Footer } from "./footer";
import { Header } from "./header";
import { VotesComponent } from "./votes-component";
import { Post, User, PostVote, Subreddit } from "@prisma/client";

type PostCardProps = {
  post?: Post & {
    PostVote: PostVote[];
    subreddit: Subreddit;
    author: User;
  };
  isLoading?: boolean;
};

export const Card = ({ post, isLoading }: PostCardProps): JSX.Element => {
  const { id, author, votesCount, title, content, subreddit } = post ?? {};

  const userMagnitude = ((post && post.PostVote[0]?.magnitude) ?? 0) as
    | -1
    | 0
    | 1;

  return (
    <div className="mb-2.5 grid grid-cols-12 rounded-md border border-neutral-700 bg-neutral-800 hover:cursor-pointer hover:border-neutral-500">
      <VotesComponent
        postId={id && id}
        votesCount={votesCount && votesCount}
        userMagnitude={userMagnitude}
        isLoading={isLoading}
      />
      <div className="space-between col-span-11 flex flex-col">
        <div className="p-2">
          <Header
            subreddit={subreddit?.name}
            author={author?.name ?? undefined}
            isLoading={isLoading}
          />
          <TitleAndBody
            isLoading={isLoading}
            title={title}
            content={content ?? undefined}
          />
        </div>
        <Footer
          label="Comments"
          icon={<ChatBubbleBottomCenterIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};
