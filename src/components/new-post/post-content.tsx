import { ChangeEvent, FC } from "react";
import { NewPostErrors } from "../../pages/new-post";

type PostContent = {
  post: {
    title: string;
    content: string;
  };
  setPost: (post: { title: string; content: string }) => void;
  errors?: NewPostErrors;
};

export const PostContent: FC<PostContent> = ({
  post,
  setPost,
  errors,
}): JSX.Element => {
  return (
    <>
      <div className="my-4 flex flex-col">
        <input
          value={post.title}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPost({ ...post, title: event.target.value })
          }
          placeholder="Title"
          className={`w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200 ${
            errors?.title ? "border-2 border-red-600" : "border-transparent"
          }`}
        />
        {errors?.title &&
          errors.title.map((error, idx) => (
            <p key={idx} className="text-sm font-medium text-red-500">
              {error}
            </p>
          ))}
      </div>

      <textarea
        value={post.content}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setPost({ ...post, content: event.target.value })
        }
        placeholder="Text (optional)"
        className={`h-36 w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200 ${
          errors?.content ? "border-2 border-red-600" : "border-transparent"
        }`}
      ></textarea>

      <div className="text-sm font-medium text-red-500">
        {errors?.content &&
          errors.content.map((error, idx) => <span key={idx}>{error}</span>)}
      </div>
    </>
  );
};
