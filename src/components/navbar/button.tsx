type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export const Button = ({ label, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="mr-3 rounded-full bg-gray-200/10 py-0.5 px-4 text-lg font-[600] text-white hover:bg-gray-200/20"
    >
      {label}
    </button>
  );
};
