import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Card } from "../../../components/card";
import { Container } from "../../../components/container";
import { Navbar } from "../../../components/navbar";
import { SubredditHeader } from "../../../components/subreddit/header";
import { SubredditNotFound } from "../../../components/subreddit/scenarios/not-found";
import { trpc } from "../../../utils/trpc";
import { Sidebar } from "../../../components/subreddit/sidebar";
import { SubredditModerator } from "@prisma/client";

export type SlugType = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context?.params?.slug === "undefined") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      slug: context?.params?.slug,
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

  const { data: posts } = trpc.posts.getBySubreddit.useQuery({
    subredditName: slug,
  });

  if (subreddit === null) return <SubredditNotFound slug={slug} />;

  const isAdmin = () => {
    return subreddit?.moderators.find(
      (moderator: SubredditModerator) =>
        moderator.userId === sessionData?.user?.id
    )
      ? true
      : false;
  };

  return (
    <>
      <Head>
        <title>{`r/${slug} - Reddat`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <SubredditHeader slug={slug} subreddit={subreddit} isAdmin={isAdmin()} />

      <Container sidebar={<Sidebar subreddit={subreddit} slug={slug} />}>
        {subreddit || posts ? (
          <>
            {posts?.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </>
        ) : (
          [1, 2, 3].map((_, idx) => <Card key={idx} isLoading={true} />)
        )}
      </Container>
    </>
  );
};

export default SubredditPage;
