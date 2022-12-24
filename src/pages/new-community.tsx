import Head from "next/head";
import { NextPage } from "next";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
/* import { useSession } from "next-auth/react"; */
import Link from "next/link";

export type newCommunityErrors = {
  name?: string[];
  description?: string[];
};

const NewCommunity: NextPage = () => {
  /* const { data: sessionData } = useSession(); */
  const router = useRouter();

  const [errors, setErrors] = useState<newCommunityErrors>();

  const communitySchema = z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9]*$/, {
        message:
          "Use only English letters and numbers, no whitespaces or special characters allowed.",
      }),
    description: z.string().max(100).optional(),
    image: z.string().url().optional(),
  });

  const [community, setCommunity] = useState({
    name: "",
    description: "",
    /* image: "", */
    /* avatar: "", */
  });

  const newCommunity = trpc.subreddit.new.useMutation();

  const handleNewCommunityButton = async () => {
    const parsedCommunity = communitySchema.safeParse(community);
    if (parsedCommunity.success) {
      const response = await newCommunity.mutateAsync(
        {
          name: parsedCommunity.data.name,
          description: parsedCommunity.data.description,
        },
        {
          onSuccess: () => {
            /* setCommunity({ name: "", description: "" }); */
            router.push(`/r/${parsedCommunity.data.name}`);
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
        <h1 className="text-2xl text-white">Create Community</h1>

        <div className="my-5 border-b-[1px] border-b-gray-400">
          <h2 className="font-bold text-gray-400">CREATE A COMMUNITY</h2>
        </div>

        <div className="my-4 flex flex-col">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-white">Name</label>
            <span className="text-sm text-gray-400">
              Community names cannot be changed
            </span>
          </div>

          <span className="relative top-10 left-2.5 w-fit text-lg text-gray-400">
            r/
          </span>
          <input
            value={community.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setCommunity({ ...community, name: event.target.value })
            }
            className={`w-full rounded-sm border-2 border-transparent bg-reddit py-3 px-7 text-white ${errors?.name ? "border-2 border-red-500" : "border-transparent"
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
          placeholder="Description (optional)"
          className={`w-full rounded-sm border-2 border-transparent bg-reddit p-3 text-gray-200 ${errors?.description
              ? "border-2 border-red-500"
              : "border-transparent"
            }`}
        />
        {errors?.description &&
          errors.description.map((error, idx) => (
            <p key={idx} className="text-sm font-medium text-red-500">
              {error}
            </p>
          ))}

        <div className="flex justify-end gap-2">
          <Link href="/">
            <button className="my-3 rounded-xl border-2 bg-transparent px-3 py-0.5 font-medium text-white hover:bg-neutral-500/10">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleNewCommunityButton}
            className="my-3 rounded-xl border-2 bg-gray-200 px-3 py-0.5 font-medium hover:bg-gray-100"
          >
            Create Community
          </button>
        </div>
      </Container>
    </>
  );
};

export default NewCommunity;
