type ButtonProps = {
  label: string | JSX.Element;
  onClick?: () => void;
};

export const Button = ({ label, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="mr-3 rounded-md bg-gray-200/10 px-2 py-0.5 text-lg font-[600] leading-none text-white hover:bg-gray-200/20"
    >
      {label}
    </button>
  );
};
