import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Container } from "../components/container";
import { Card } from "../components/card";
import { Navbar } from "../components/navbar";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  // const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: posts } = trpc.posts.getAll.useQuery();

  const ctx = trpc.useContext();

  const newPost = trpc.posts.new.useMutation({
    onSuccess: () => ctx.posts.invalidate(),
  });

  const handleNewPost = () => {
    newPost.mutateAsync({
      title: "This is another post title!",
      content: "Lorem Ipsum",
    });
  };

  return (
    <>
      <Head>
        <title>Reddat: Reddit clone by github.com/oasido</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Container>
        <button
          onClick={() => handleNewPost()}
          className="m-2 rounded-full bg-white px-2 py-0.5 font-bold"
        >
          New Post
        </button>
        {posts?.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </Container>
    </>
  );
};

export default Home;
