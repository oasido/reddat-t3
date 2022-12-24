import { ChatBubbleBottomCenterIcon } from "@heroicons/react/20/solid";
import { Post, PostVote, Subreddit, User } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Footer } from "./footer";
import { Header } from "./header";
import { TitleAndBody } from "./title-and-body";
import { VotesComponent } from "./votes-component";

type PostCardProps = {
  post?: Post & {
    id: string;
    PostVote: PostVote[];
    subreddit: Subreddit;
    author: User;
  };
  isLoading?: boolean;
  single?: boolean;
};

export const Card = ({
  post,
  isLoading,
  single,
}: PostCardProps): JSX.Element => {
  const { id, author, votesCount, title, content, subreddit } = post ?? {};

  const userMagnitude = ((post && post.PostVote[0]?.magnitude) ?? 0) as
    | -1
    | 0
    | 1;

  dayjs.extend(relativeTime);

  return (
    <Link href={isLoading ? "#" : `/r/${subreddit?.name}/${id}`}>
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
              timeAgo={dayjs().to(post?.createdAt)}
            />
            <TitleAndBody
              isLoading={isLoading}
              title={title}
              content={content ?? undefined}
              single={single}
            />
          </div>
          {!single && (
            <Footer
              label="Comments"
              icon={<ChatBubbleBottomCenterIcon className="h-4 w-4" />}
            />
          )}
        </div>
      </div>
    </Link>
  );
};
