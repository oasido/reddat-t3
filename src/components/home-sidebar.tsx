import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const HomeSidebar = ({ isLoading }: { isLoading?: boolean }) => {
  const { data: sessionData } = useSession();

  return (
    <div className="mb-2.5 rounded-md border border-neutral-700 bg-neutral-800">
      <div className="space-between flex flex-col">
        <Image
          src="https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png"
          width={310}
          height={34}
          alt="home banner"
        />
        <div className="p-2">
          <h4 className="mb-3 text-sm font-bold text-gray-400">Home</h4>
          <p className="mb-2 text-sm text-gray-200">
            The frontpage of the interwebs. You can check out your favorite
            communities here.
          </p>

          {sessionData && (
            <div className="my-3 flex flex-col gap-2">
              <Link href="/new-post">
                <button className="mx-2 rounded-xl border-2 bg-gray-300 px-3 py-0.5 text-sm font-[600] hover:bg-gray-100">
                  Create Post
                </button>
              </Link>
              <Link href="/new-community">
                <button className="mx-2 rounded-xl border-2 bg-transparent px-3 py-0.5 text-sm font-[600] text-gray-300 hover:bg-gray-500/10">
                  Create Community
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
