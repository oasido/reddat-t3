type TitleAndBodyProps = {
  title: string;
  body: string;
};

export const TitleAndBody = ({ title, body }: TitleAndBodyProps) => {
  return (
    <>
      <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-50">{body}</p>
    </>
  );
};
