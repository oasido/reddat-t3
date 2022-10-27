import Head from "next/head";
import { NextPage } from "next";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
// import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { SelectFromSubs } from "../components/new-post/select-from-subs";
import { z } from "zod";
import type { selectedSub } from "../components/new-post/select-from-subs";

const NewPost: NextPage = () => {
  // const ctx = trpc.useContext();
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [selectedSub, setSelectedSub] = useState<selectedSub>();

  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (!sessionData) {
      router.push("/");
    }
  }, [router, sessionData]);

  return (
    <>
      <Head>
        <title>Reddat: Reddit clone by github.com/oasido</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Container>
        <h2 className="text-xl font-bold text-white">New post</h2>

        <SelectFromSubs
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
        />

        <input
          value={post.title}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPost({ ...post, title: event.target.value })
          }
          placeholder="Title"
          className="mb-2 w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200"
        />
        <textarea
          value={post.content}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setPost({ ...post, title: event.target.value })
          }
          placeholder="Text (required)"
          className="h-36 w-full rounded-md border-neutral-700 bg-neutral-800 p-2 text-gray-200"
        ></textarea>
        <div className="align-items flex justify-end">
          Test
          <button className="my-2 rounded-xl border-2 bg-gray-300 px-3 py-0.5 text-sm font-[600] hover:bg-gray-100">
            Submit New Post
          </button>
        </div>
      </Container>
    </>
  );
};

export default NewPost;

const newPostSchema = z.object({
  subredditId: z.string(),
  title: z.string().min(1).max(140),
  content: z.string().min(1).max(6000),
});

const submitNewPost = async ({
  subredditId,
  title,
  content,
}: z.infer<typeof newPostSchema>) => {
  const parsedNewPost = newPostSchema.parse({
    subredditId,
    title,
    content,
  });

  // const { data } = await trpc.posts.new.useMutation({
  //   subredditId,
  //   title,
  //   content,
  // });

  // router.push(`/r/${data.subreddit.name}/${data.id}`);
};
