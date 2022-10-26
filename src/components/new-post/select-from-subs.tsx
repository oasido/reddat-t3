import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { trpc } from "../../utils/trpc";

export const SelectFromSubs = () => {
  const { data: subreddits } = trpc.subreddit.getAll.useQuery();

  const [selectedPerson, setSelectedPerson] = useState();
  const [query, setQuery] = useState("");

  const filteredSubs =
    query === ""
      ? subreddits
      : subreddits?.filter((sub) => {
          return sub.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredSubs?.map((sub) => (
          <Combobox.Option key={sub.id} value={sub.name} className="text-white">
            {sub.name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};
