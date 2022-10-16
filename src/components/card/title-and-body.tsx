type TitleAndBodyProps = {
  title: string;
  content: string;
};

export const TitleAndBody = ({ title, content }: TitleAndBodyProps) => {
  return (
    <>
      <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-50">{content}</p>
    </>
  );
};
