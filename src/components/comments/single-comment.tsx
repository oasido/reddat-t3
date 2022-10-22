import { User, Comment } from "@prisma/client";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type SingleCommentProps = {
  author: User;
  comment: Comment;
};

dayjs.extend(relativeTime);

export const SingleComment = ({
  author,
  comment,
}: SingleCommentProps): JSX.Element => {
  return (
    <>
      <div className="mx-3 mt-1 p-2">
        <div className="flex items-center gap-3">
          <Image
            className="rounded-full"
            alt={`${author.name}'s avatar`}
            src={
              author.image ??
              `https://avatars.dicebear.com/api/initials/${author.name}.svg`
            }
            width={30}
            height={30}
          />
          <span className="text-xs font-[600] text-white">{author.name}</span>
          <span className="text-xs font-[600] text-gray-500">
            {dayjs().to(comment.createdAt)}
          </span>
        </div>
        <div className="ml-10 text-gray-200">{comment.content}</div>
      </div>
    </>
  );
};
