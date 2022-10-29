import { Combobox, Transition } from "@headlessui/react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export type selectedSub =
  | {
      id: string;
      name: string;
      image: string | null;
    }
  | undefined;

type SelectFromSubsProps = {
  selectedSub: selectedSub;
  setSelectedSub: (sub: selectedSub) => void;
  errors?: string[];
};

export const SelectFromSubs = ({
  selectedSub,
  setSelectedSub,
  errors,
}: SelectFromSubsProps) => {
  const { data: subreddits } = trpc.subreddit.getAll.useQuery();

  const [query, setQuery] = useState("");

  const filteredSubs =
    query === ""
      ? subreddits
      : subreddits?.filter((sub) => {
          return sub.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="my-4">
      <div className="w-full rounded-md border border-transparent hover:border-neutral-500/50 sm:w-64">
        <Combobox
          nullable
          value={selectedSub?.name}
          onChange={(selected) => {
            setSelectedSub(subreddits?.find(({ name }) => name === selected));
          }}
        >
          <Combobox.Button
            as="div"
            className={`relative rounded-md border-neutral-700 outline-none ring-0 ${
              errors ? "border-2 border-red-600" : "border-transparent"
            }`}
          >
            <Combobox.Input
              placeholder="Select a subreddit"
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-md bg-neutral-800 p-3 py-2 pl-3 pr-10 text-gray-200 hover:cursor-pointer hover:border-neutral-500"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </Combobox.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Combobox.Options
              className="absolute z-10 mt-1 max-h-60 min-w-fit overflow-auto
                        rounded-md border border-neutral-700 bg-neutral-800 py-1 text-base shadow-lg
                        ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-64"
            >
              {filteredSubs?.map((sub) => (
                <Combobox.Option
                  key={sub.id}
                  value={sub.name}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-1.5 px-6 ${
                      active
                        ? "bg-neutral-700 text-neutral-300"
                        : "text-neutral-300"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div
                      className={`flex items-center gap-2 truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      <Image
                        src={
                          sub.image ??
                          `https://avatars.dicebear.com/api/initials/${sub.name}.svg`
                        }
                        className="rounded-full"
                        width={30}
                        height={30}
                        alt={`${sub.name} icon`}
                      />
                      r/{sub.name}
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
      {errors &&
        errors.map((error, idx) => (
          <p key={idx} className="text-sm font-medium text-red-500">
            {error}
          </p>
        ))}
    </div>
  );
};
