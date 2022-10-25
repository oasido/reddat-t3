import { Menu, Transition } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
  danger?: boolean;
  onClick?: () => void;
};

const menuItems: MenuItem[] = [
  {
    label: "Profile",
    href: "", // "/profile"
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "User Settings",
    href: "", // "/settings"
    icon: <ArrowTrendingUpIcon className="h-4 w-4" />,
  },
  {
    label: "Log Out",
    href: "", // keep empty, we'll use onClick instead
    icon: <ArrowLeftOnRectangleIcon className="h-4 w-4" />,
    onClick: () => signOut(),
    danger: true,
  },
];

export const UserMenu = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="mr-2 w-fit rounded-sm border border-transparent hover:border-neutral-500/50 ">
      <Menu>
        <div className="relative z-10 my-1.5">
          <Menu.Button className="flex w-full cursor-pointer justify-center rounded-lg bg-neutral-800 pl-2 pr-8 text-left text-lg text-white focus:outline-none focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-300 sm:pr-10">
            <div className="flex items-center gap-1">
              <Image
                className="rounded-sm"
                src={
                  sessionData?.user?.image ??
                  `https://avatars.dicebear.com/api/initials/${sessionData?.user?.name}.svg`
                }
                width={25}
                height={25}
                alt={`${sessionData?.user?.name}'s avatar`}
              />

              <span className="hidden text-xs font-[600] sm:block">
                {sessionData?.user?.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </div>
          </Menu.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 mt-1 max-h-60 w-full min-w-fit overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="relative cursor-pointer select-none">
                {menuItems.map((item, idx) => (
                  <a key={idx}>
                    <Link href={item.href ?? "#"}>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`h-full w-full py-2 px-3 ${
                              active
                                ? "bg-neutral-700 text-neutral-300"
                                : "text-neutral-300"
                            }`}
                            onClick={item.onClick && item.onClick}
                          >
                            <div
                              className={`flex items-center gap-2 truncate 
                        ${active ? "font-medium" : "font-normal"} ${
                                item.danger && " text-red-500"
                              }`}
                            >
                              {item.icon}
                              {item.label}
                            </div>
                          </button>
                        )}
                      </Menu.Item>
                    </Link>
                  </a>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </div>
  );
};
