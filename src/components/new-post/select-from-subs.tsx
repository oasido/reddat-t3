import { Combobox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

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

  const [filteredSubs, setFilteredSubs] = useState(subreddits);

  const searchSub = (query: string) => {
    setFilteredSubs(
      subreddits?.filter((sub) =>
        sub.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="my-4">
      <div className="w-full rounded-sm sm:w-72">
        <Combobox
          nullable
          value={selectedSub?.name ? `r/${selectedSub?.name}` : ""}
          onChange={(selected) => {
            setSelectedSub(subreddits?.find(({ name }) => name === selected));
          }}
        >
          <Combobox.Button
            as="div"
            className={`relative rounded-sm border-neutral-700 outline-none ring-0 ${errors ? "border-2 border-red-500" : "border-transparent"
              }`}
            onClick={() => {
              console.log(filteredSubs, query);
              if (
                (filteredSubs?.length === 0 || filteredSubs === undefined) &&
                query === "" &&
                !selectedSub
              ) {
                setFilteredSubs(subreddits);
              }
            }}
          >
            {selectedSub ? (
              <div className="absolute bottom-0.5 left-2">
                <Image
                  src={
                    selectedSub.image ??
                    `https://avatars.dicebear.com/api/initials/${selectedSub.name}.svg`
                  }
                  className="rounded-full"
                  width={30}
                  height={30}
                  alt={`${selectedSub.name} icon`}
                />
              </div>
            ) : (
              <div className="absolute bottom-0 top-2 left-2 h-8 w-8 rounded-full border-4 border-dotted border-neutral-600"></div>
            )}
            <Combobox.Input
              placeholder="Choose a community"
              onChange={(event) => searchSub(event.target.value)}
              className="w-full rounded-sm bg-reddit py-3 px-12 text-gray-200 hover:cursor-pointer"
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
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm
                        border border-neutral-700  bg-reddit py-1 text-base shadow-lg
                        ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-72"
            >
              {filteredSubs?.map((sub) => (
                <Combobox.Option
                  key={sub.id}
                  value={sub.name}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-1.5 px-6 ${active
                      ? "bg-neutral-800/50 text-gray-400"
                      : "text-gray-400"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div
                      className={`flex items-center gap-2 truncate ${selected ? "font-medium" : "font-normal"
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
              {filteredSubs?.length === 0 && (
                <span className="p-3 text-gray-400">Nothing found</span>
              )}
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
