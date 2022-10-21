import { Fragment, ReactNode, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronUpDownIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

type MenuItem = {
  id: number;
  label: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { id: 1, label: "Home", icon: <HomeIcon className="h-4 w-4" /> },
  {
    id: 2,
    label: "Trending",
    icon: <ArrowTrendingUpIcon className="h-4 w-4" />,
  },
  { id: 3, label: "All", icon: <ChartBarIcon className="h-4 w-4" /> },
];

export const Select = () => {
  const [selected, setSelected] = useState(menuItems[0]);

  return (
    <div className="w-full sm:w-64">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative z-10 mt-1">
          <Listbox.Button className="flex w-full cursor-pointer items-center rounded-lg bg-neutral-800 py-1 pl-3 pr-10 text-left text-lg text-white focus:outline-none focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-300">
            <span className="mr-2 h-4 w-4">{selected?.icon}</span>
            <span className="hidden truncate sm:block">{selected?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute mt-1 max-h-60 w-full min-w-fit 
                        overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1
                        ring-black ring-opacity-5 focus:outline-none"
            >
              {menuItems.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-neutral-700 text-neutral-300"
                        : "text-neutral-300"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-2 truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : undefined}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
