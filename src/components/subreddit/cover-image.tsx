import Image from "next/image.js";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SubredditModerator } from "@prisma/client";
import axios from "axios";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { trpc } from "../../utils/trpc";

export const CoverImage = ({
  subredditMods,
  subredditCoverImage,
  subredditId,
}: {
  subredditMods: SubredditModerator[];
  subredditCoverImage: string | null;
  subredditId: string;
}) => {
  const { data: sessionData } = useSession();
  const [isCoverMenuOpen, setIsOpenMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebouncedValue(searchQuery, 400);

  type ResponseSchema = {
    results: {
      id: string;
      description: string | null;
      url: string;
    }[];
  };

  const [images, setImages] = useState<ResponseSchema | undefined>();

  const searchUnsplash = async () => {
    if (typeof debounced === "string" && debounced.length > 2) {
      const response = await axios.get(`/api/unsplash?query=${debounced}`);
      setImages(response.data);
    }
  };

  useEffect(() => {
    if (typeof debounced === "string" && debounced.length > 0) {
      searchUnsplash();
    }
  }, [debounced]);

  const defaultCoverImages = [
    "https://images.unsplash.com/photo-1429704658776-3d38c9990511?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1679&q=80",
    "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2153&q=80",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1513&q=80",
    "https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1555432384-3b2fa7b650c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    "https://images.unsplash.com/photo-1557128928-66e3009291b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1560036043-1a6b17791807?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1553532434-5ab5b6b84993?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
  ];

  const toggleCoverSelectionMenu = () => {
    setIsOpenMenuOpen(!isCoverMenuOpen);
  };

  const changeCoverImage = trpc.subreddit.changeCoverImage.useMutation();

  const ctx = trpc.useContext();

  const handleChangeCover = async (src: string) => {
    try {
      await changeCoverImage.mutateAsync(
        {
          source: src,
          userId: sessionData?.user?.id ?? "",
          subredditId: subredditId,
        },
        {
          onSuccess: () => {
            ctx.invalidate();
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative h-36 min-w-[260px] bg-transparent align-baseline">
      {subredditCoverImage && (
        <Image
          src={subredditCoverImage}
          layout="fill"
          objectFit="cover"
          alt="Cover Image"
          objectPosition="center"
          className="mx-auto"
        />
      )}
      {subredditMods.some((mod) => mod.userId === sessionData?.user?.id) && (
        <button
          onClick={toggleCoverSelectionMenu}
          className="absolute top-2 right-2 rounded-md bg-neutral-100/10 p-1.5 text-sm font-[600] text-black/50 hover:bg-white/50 hover:text-black/80 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      )}
      {isCoverMenuOpen === true && (
        <div className="absolute right-12 top-2 flex max-h-96 flex-col overflow-y-auto rounded-md bg-neutral-700 px-3 py-2">
          <label className="mb-2 text-lg font-bold text-white">
            Change cover
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="mb-2 rounded-md border-2 border-none bg-neutral-800/80 p-1.5 text-white "
          />
          <div className="grid grid-cols-2 gap-2">
            {!images
              ? defaultCoverImages.map((image) => (
                  <Image
                    key={image}
                    src={image}
                    width={150}
                    height={90}
                    alt="image"
                    className="hover:cursor-pointer"
                    onClick={() => handleChangeCover(image)}
                  />
                ))
              : images?.results?.map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    width={150}
                    height={90}
                    alt={image.description ?? "image"}
                    className="hover:cursor-pointer"
                    onClick={() => handleChangeCover(image.url)}
                  />
                ))}
            {images?.results?.length === 0 && (
              <p className="text-gray-200">No pictures found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
