import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Container } from "../components/container";
import { Card } from "../components/card";
import { Navbar } from "../components/navbar";
import { NewPostBar } from "../components/new-post-bar";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: posts } = trpc.posts.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Reddat: Reddit clone by github.com/oasido</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <Container>
        {sessionData && <NewPostBar />}
        {posts?.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </Container>
    </>
  );
};

export default Home;
