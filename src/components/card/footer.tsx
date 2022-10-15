type FooterProps = {
  label: string;
  icon: JSX.Element;
};

export const Footer = ({ label, icon }: FooterProps): JSX.Element => {
  return (
    <div className="flex items-center p-1">
      <button className="flex items-end rounded-md p-2 font-[600] text-gray-400 hover:bg-gray-200/5">
        <div className="mr-1 text-lg">{icon}</div>
        <span className="text-sm">{label}</span>
      </button>
    </div>
  );
};
