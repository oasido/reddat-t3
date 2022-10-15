import { Button } from "./button";
import { Select } from "./select";
import { signIn, useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="flex h-12 items-center justify-between border-b-[2px] border-neutral-600 bg-neutral-800">
      <div className="flex items-center">
        <span className="pointer-events-none mx-5 select-none text-2xl text-white">
          reddat
        </span>
        <Select />
      </div>

      <div>
        <Button
          label={sessionData ? sessionData.user?.name ?? "Logout" : "Login"}
          onClick={sessionData ? undefined : () => signIn("reddit")}
        />
      </div>
    </nav>
  );
};
