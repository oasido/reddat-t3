import Head from "next/head";
import { NextPage } from "next";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { useState } from "react";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

const newCommunitySchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(3).max(100),
});

export type NewPostErrors = {
  name?: string[];
  description?: string[];
};

const NewCommunity: NextPage = () => {
  // const { data: sessionData } = useSession();
  const router = useRouter();

  const [errors, setErrors] = useState<NewPostErrors>();

  const [post, setPost] = useState({
    name: "",
    description: "",
  });

  const newPost = trpc.posts.newPost.useMutation();

  const handleNewCommunityButton = async ({
    name,
    description,
  }: z.infer<typeof newCommunitySchema>) => {
    const parsedNewCommunity = newCommunitySchema.safeParse({
      name,
      description,
    });

    // if (parsedNewCommunity.success) {
    //   setErrors(undefined);
    //   await newPost.mutateAsync(
    //     {
    //       name,
    //       description,
    //     },
    //     {
    //       onSuccess: () => {
    //         setPost({ name: "", description: "" });
    //         router.push("/");
    //       },
    //       onError: (error) => console.log(error),
    //     }
    //   );
    // } else {
    //   setErrors(parsedNewCommunity.error.flatten().fieldErrors);
    // }
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
          Create a meow community
        </h2>

        {/* <PostContent post={post} setPost={setPost} errors={errors} /> */}
        <div className="flex justify-end">
          <button
            onClick={() =>
              handleNewCommunityButton({
                name: post.name,
                description: post.description,
              })
            }
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
