import { ReactNode } from "react";

type containerProps = {
  children: ReactNode;
};

export const Container = ({ children }: containerProps) => {
  return (
    <main className="mx-auto w-full max-w-3xl flex-grow bg-black p-4">
      {children}
    </main>
  );
};
