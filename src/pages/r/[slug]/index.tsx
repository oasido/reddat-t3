import { SubredditModerator } from "@prisma/client";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "../../../components/card";
import { Container } from "../../../components/container";
import { Navbar } from "../../../components/navbar";
import { SubredditHeader } from "../../../components/subreddit/header";
import { SubredditNotFound } from "../../../components/subreddit/scenarios/not-found";
import { Sidebar } from "../../../components/subreddit/sidebar";
import { prisma } from "../../../server/db/client";
import { trpc } from "../../../utils/trpc";

export type SlugType = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  const subreddit = await prisma.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (subreddit === null) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      slug,
    },
  };
};

const SubredditPage: NextPage = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: sessionData } = useSession();

  const { data: subreddit } = trpc.subreddit.getOne.useQuery({
    subredditName: slug,
  });

  const { ref, inView } = useInView();

  const {
    data: posts,
    /* isLoading, */
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.posts.getBySubreddit.useInfiniteQuery(
    {
      subredditName: slug,
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

  const { data: subscribedToSubreddits } =
    trpc.subreddit.getUserSubscriptions.useQuery({
      userId: sessionData?.user?.id ?? "",
    });

  if (subreddit === null) return <SubredditNotFound slug={slug} />;

  const isAdmin = () => {
    return subreddit?.SubredditModerator.find(
      (moderator: SubredditModerator) =>
        moderator.userId === sessionData?.user?.id
    )
      ? true
      : false;
  };

  const isSubscribed = () => {
    const isFound = subscribedToSubreddits?.subreddits.some(
      (sub) => sub.subredditId === subreddit?.id
    );
    return isFound ? true : false;
  };

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
        <title>{`r/${slug} - Reddat`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <SubredditHeader
        slug={slug}
        subreddit={subreddit}
        isAdmin={isAdmin()}
        isSubscribed={isSubscribed()}
      />

      <Container sidebar={<Sidebar subreddit={subreddit} slug={slug} />}>
        {subreddit || posts ? (
          <>
            {posts?.pages.map((page) =>
              page.posts.map((post) => <Card key={post.id} post={post} />)
            )}
          </>
        ) : (
          [1, 2, 3].map((_, idx) => <Card key={idx} isLoading={true} />)
        )}

        <h3
          ref={ref}
          className="my-10 text-center text-2xl font-[600] text-white"
        >
          {showMorePostsPrompt()}
        </h3>
      </Container>
    </>
  );
};

export default SubredditPage;
