import Head from "next/head";
import { NextPage } from "next";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
/* import { useSession } from "next-auth/react"; */

const newCommunitySchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().max(100).optional(),
  image: z.string().url().optional(),
  /* avatar: z.string().url().optional(), */
});

export type newCommunityErrors = {
  name?: string[];
  description?: string[];
};

const NewCommunity: NextPage = () => {
  /* const { data: sessionData } = useSession(); */
  const router = useRouter();

  const [errors, setErrors] = useState<newCommunityErrors>();

  const [community, setCommunity] = useState({
    name: "",
    description: "",
    /* image: "", */
    /* avatar: "", */
  });

  const newCommunity = trpc.subreddit.new.useMutation();

  const handleNewCommunityButton = async () => {
    const parsedCommunity = newCommunitySchema.safeParse(community);
    if (parsedCommunity.success) {
      const response = await newCommunity.mutateAsync(
        {
          name: parsedCommunity.data.name,
          description: parsedCommunity.data.description,
        },
        {
          onSuccess: () => {
            setCommunity({ name: "", description: "" });
            router.push("/");
          },
          onError: (error) => console.log(error),
        }
      );
      if (response?.error) {
        setErrors({ name: [response.msg] });
      }
    } else {
      setErrors(parsedCommunity.error.flatten().fieldErrors);
    }
  };

  return (
    <>
      <Head>
        <title>Reddat: Reddit clone by github.com/oasido</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <Container>
        <h2 className="mb-4 text-xl font-bold text-white">
          Create a new community
        </h2>

        <>
          <div className="my-4 flex flex-col">
            <input
              value={community.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setCommunity({ ...community, name: event.target.value })
              }
              placeholder="Community name"
              className={`h-fit w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200 ${
                errors?.name ? "border-2 border-red-600" : "border-transparent"
              }`}
            />
            {errors?.name &&
              errors.name.map((error, idx) => (
                <p key={idx} className="text-sm font-medium text-red-500">
                  {error}
                </p>
              ))}
          </div>

          <textarea
            value={community.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setCommunity({ ...community, description: event.target.value })
            }
            placeholder="Description"
            className={`w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200 ${
              errors?.description
                ? "border-2 border-red-600"
                : "border-transparent"
            }`}
          />
          {errors?.description &&
            errors.description.map((error, idx) => (
              <p key={idx} className="text-sm font-medium text-red-500">
                {error}
              </p>
            ))}
        </>

        <div className="flex justify-end">
          <button
            onClick={handleNewCommunityButton}
            className="my-3 rounded-xl border-2 bg-gray-300 px-3 py-0.5 text-sm font-[600] hover:bg-gray-100"
          >
            Create
          </button>
        </div>
      </Container>
    </>
  );
};

export default NewCommunity;
