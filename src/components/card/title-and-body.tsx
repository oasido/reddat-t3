type TitleAndBodyProps = {
  title?: string;
  content?: string;
  isLoading?: boolean;
  single?: boolean;
};

export const TitleAndBody = ({
  title,
  content,
  isLoading,
  single,
}: TitleAndBodyProps) => {
  return isLoading === true ? (
    <div className="animate-pulse">
      <div className="bg-neutral-400/ my-3 h-5 w-32 rounded-lg bg-neutral-400/20" />
      <div className="mt-1 h-4 w-48 rounded-lg bg-neutral-400/20" />
    </div>
  ) : (
    <>
      <h3 className={`${!title && "italic"} mt-1 text-xl font-bold text-white`}>
        {title ?? `Untitled`}
      </h3>
      <div
        className={`${!content && "italic"} whitespace-pre-wrap text-gray-50`}
      >
        <p className={`${!single && "line-clamp-6"}`}>
          {content ?? `This post is empty`}
        </p>
      </div>
    </>
  );
};
