import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const NewPostBar = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="mb-2.5 grid grid-cols-12 gap-2 rounded-md border border-neutral-700 bg-neutral-800 p-3 hover:cursor-pointer hover:border-neutral-500">
      <div className="hidden items-center justify-center sm:col-span-1 sm:flex">
        <Image
          className="rounded-full"
          src={
            sessionData?.user?.image ??
            `https://avatars.dicebear.com/api/initials/${sessionData?.user?.name}.svg`
          }
          width={40}
          height={40}
          alt={`${sessionData?.user?.name}'s avatar`}
        />
      </div>
      <Link href="/new-post">
        <input
          type="text"
          placeholder="New post..."
          className="col-span-12 resize-none rounded-md border-0 bg-neutral-700 p-2 text-white outline-0 sm:col-span-11
        "
        />
      </Link>
    </div>
  );
};
