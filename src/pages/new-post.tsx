import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { PostContent } from "../components/new-post/post-content";
import type { selectedSub } from "../components/new-post/select-from-subs";
import { SelectFromSubs } from "../components/new-post/select-from-subs";
import { trpc } from "../utils/trpc";
// import { useSession } from "next-auth/react";

const newPostSchema = z.object({
  subredditId: z.string().min(5, { message: "Please select a subreddit" }),
  title: z
    .string()
    .min(3, { message: "Title must have at least 3 characters" })
    .max(140),
  content: z.string().max(6000, { message: "Your post is too long, chap!" }),
});

export type NewPostErrors = {
  subredditId?: string[];
  title?: string[];
  content?: string[];
};

const NewPost: NextPage = () => {
  // const { data: sessionData } = useSession();
  const router = useRouter();

  const [selectedSub, setSelectedSub] = useState<selectedSub>();
  const [errors, setErrors] = useState<NewPostErrors>();

  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const newPost = trpc.posts.newPost.useMutation();

  const submitNewPost = async ({
    subredditId,
    title,
    content,
  }: z.infer<typeof newPostSchema>) => {
    typeof subredditId === "undefined" &&
      new Error("Subreddit ID must be a string");

    const parsedPost = newPostSchema.safeParse({
      subredditId,
      title,
      content,
    });

    if (parsedPost.success) {
      setErrors(undefined);
      await newPost.mutateAsync(
        {
          subredditId,
          title,
          content,
        },
        {
          onSuccess: () => {
            setPost({ title: "", content: "" });
            setSelectedSub(undefined);
            router.push("/");
          },
          onError: (error) => console.log(error),
        }
      );
    } else {
      setErrors(parsedPost.error.flatten().fieldErrors);
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
        <h1 className="text-2xl text-white">Create Post</h1>

        <div className="my-5 border-b-[1px] border-b-zinc-400">
          <h2 className="font-bold text-zinc-400">CREATE A POST</h2>
        </div>

        <SelectFromSubs
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          errors={errors?.subredditId}
        />
        <PostContent post={post} setPost={setPost} errors={errors} />
        <div className="flex justify-end">
          <button
            onClick={() =>
              submitNewPost({
                subredditId: selectedSub?.id ?? "",
                title: post.title,
                content: post.content,
              })
            }
            className="my-3 rounded-xl border-2 bg-zinc-200 px-3 py-0.5 font-medium hover:bg-gray-100"
          >
            Post
          </button>
        </div>
      </Container>
    </>
  );
};

export default NewPost;
