import { Select } from "./select";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { UserMenu } from "./user-dropdown";
import { FiGithub } from "react-icons/fi";

export const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="flex h-12 items-center justify-between border-b-2 border-neutral-600 bg-neutral-800">
      <div className="flex items-center">
        <Link href="/">
          <a className="mx-5 select-none text-2xl text-white hover:cursor-pointer">
            reddat
          </a>
        </Link>
        <Select />
      </div>

      <div className="flex items-center justify-center">
        <a
          href="https://github.com/oasido/reddat-t3"
          target="_blank"
          rel="noreferrer"
          className="mr-1 rounded-full p-2 text-xl text-gray-200 hover:bg-neutral-500/50"
        >
          <FiGithub />
        </a>
        {sessionData ? (
          <UserMenu />
        ) : (
          <button
            onClick={() => signIn("reddit")}
            className="mx-3 rounded-full bg-gray-300 px-4 py-0.5 font-bold"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
