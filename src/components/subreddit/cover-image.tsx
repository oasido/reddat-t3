import Image from "next/image.js";
import { useState } from "react";
import { env } from "../../env/client.mjs";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { SubredditModerator } from "@prisma/client";

const UnsplashImageSchema = z
  .object({
    id: z.string(),
    user: z.object({
      username: z.string(),
    }),
    urls: z.object({
      regular: z.string(),
    }),
  })
  .transform((result) => ({
    id: result.id,
    username: result.user.username,
    url: result.urls.regular,
  }));

const UnsplashResponseSchema = z.array(UnsplashImageSchema);

export const CoverImage = ({
  subredditMods,
}: {
  subredditMods: SubredditModerator[];
}) => {
  const { data: sessionData } = useSession();
  const key = env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const [images, setImages] =
    useState<z.infer<typeof UnsplashResponseSchema>>();

  const fetchImages = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=2`,
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${key}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const parsedData = UnsplashResponseSchema.parse(data);
    setImages(parsedData);
    console.log(parsedData);
  };

  // useEffect(() => {
  //   fetchImages();
  // }, []);

  return (
    <div className="relative h-36 min-w-[260px] bg-transparent align-baseline">
      <Image
        src="https://images.unsplash.com/photo-1664440163809-25f00e4065ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzYwNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjcwMDQ3MzM&ixlib=rb-4.0.3&q=80&w=1080"
        layout="fill"
        objectFit="cover"
        alt="Cover Image"
        objectPosition="center"
        className="mx-auto"
      />
      {subredditMods.some((mod) => mod.userId === sessionData?.user?.id) && (
        <button className="absolute top-2 right-2 rounded-full bg-white/50 px-2 py-0.5 text-sm font-[600] text-black/50 hover:bg-white/80 hover:text-black/80 hover:shadow-md">
          Change Cover
        </button>
      )}
    </div>
  );
};
