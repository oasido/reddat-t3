import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Container } from "../components/container";
import { Card } from "../components/card";
import { Navbar } from "../components/navbar";
import { NewPostBar } from "../components/new-post-bar";
import { useSession } from "next-auth/react";
import { HomeSidebar } from "../components/home-sidebar";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  const numberOfLoadingCards = [1, 2, 3, 4, 5];

  return (
    <>
      <Head>
        <title>Reddat: Reddit clone by github.com/oasido</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <Container sidebar={<HomeSidebar isLoading={isLoading} />}>
        {sessionData && <NewPostBar />}
        {isLoading &&
          numberOfLoadingCards.map((_, idx) => <Card key={idx} isLoading />)}
        {posts?.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </Container>
    </>
  );
};

export default Home;
