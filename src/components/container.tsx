import { ReactNode } from "react";

type containerProps = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export const Container = ({ children, sidebar }: containerProps) => {
  return sidebar ? (
    <main className="mx-auto max-w-4xl bg-black py-4 px-2 md:grid md:grid-cols-6 md:gap-2">
      <div className="md:col-span-4">{children}</div>
      <div className="hidden md:col-span-2 md:block">
        {sidebar ?? <h1>sup</h1>}
      </div>
    </main>
  ) : (
    <main className="mx-auto w-full max-w-3xl flex-grow bg-black p-4">
      {children}
    </main>
  );
};
