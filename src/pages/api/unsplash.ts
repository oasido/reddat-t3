import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/client.mjs";
import { z } from "zod";

export const unsplashResponseSchema = z.object({
  results: z.array(
    z
      .object({
        id: z.string(),
        description: z.string().nullable(),
        urls: z.object({
          regular: z.string(),
        }),
      })
      .transform((res) => ({
        id: res.id,
        description: res.description,
        url: res.urls.regular,
      }))
  ),
});

const unsplash = async (req: NextApiRequest, res: NextApiResponse) => {
  const key = env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const searchSchema = z.string().trim().min(2).max(50);

  const { query } = req.query;

  try {
    const searchQuery = searchSchema.parse(query);

    const response = await fetch(
      `https://api.unsplash.com/search/photos/?query=${searchQuery}&client_id=${key}`
    ).then((res) => res.json());
    const parsedUnsplashResponse = unsplashResponseSchema.parse(response);

    res.send(parsedUnsplashResponse);
  } catch (error) {
    res.send(error);
  }
};

export default unsplash;
