import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "../components/card";
import { Container } from "../components/container";
import { HomeSidebar } from "../components/home-sidebar";
import { Navbar } from "../components/navbar";
import { NewPostBar } from "../components/new-post-bar";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { ref, inView } = useInView();

  const {
    data: posts,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.posts.getAll.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const numberOfLoadingCards = [1, 2, 3, 4, 5];

  const isNoPosts = () => (posts?.pages[0]?.posts.length === 0 ? true : false);

  const showMorePostsPrompt = () => {
    if (isFetchingNextPage) {
      return "Loading more...";
    } else if (hasNextPage) {
      return "Scroll to load more";
    } else if (isNoPosts()) {
      return "No posts here, yet";
    } else if (!hasNextPage) {
      return "No more posts";
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

      <Container sidebar={<HomeSidebar />}>
        {sessionData && <NewPostBar />}
        {isLoading &&
          numberOfLoadingCards.map((_, idx) => <Card key={idx} isLoading />)}

        {posts?.pages.map((page) =>
          page.posts.map((post) => <Card key={post.id} post={post} />)
        )}

        {posts?.pages.length === 0 && (
          <h2 className="my-36 text-center text-3xl font-[600] text-white">
            Be the first to post something. {!sessionData && "Login now."}
          </h2>
        )}

        {!isLoading && (
          <h3
            ref={ref}
            className="my-10 text-center text-2xl font-[600] text-white"
          >
            {showMorePostsPrompt()}
          </h3>
        )}
      </Container>
    </>
  );
};

export default Home;
