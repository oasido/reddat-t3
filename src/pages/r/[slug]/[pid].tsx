import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Card } from "../../../components/card";
import { Container } from "../../../components/container";
import { Navbar } from "../../../components/navbar";
import { SubredditHeader } from "../../../components/subreddit/header";
import { SubredditNotFound } from "../../../components/subreddit/scenarios/not-found";
import { trpc } from "../../../utils/trpc";
import { Sidebar } from "../../../components/subreddit/sidebar";
import { Comments } from "../../../components/comments";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      params: context?.params,
    },
  };
};

const Post: NextPage = ({
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { data: subreddit } = trpc.subreddit.getOne.useQuery({
    subredditName: params?.slug,
  });

  const { data: post } = trpc.posts.getOne.useQuery({
    id: params?.pid,
  });

  if (subreddit === null) return <SubredditNotFound slug={params.slug} />;

  // const isPostCreator = () => {
  //   logic here
  // };

  return (
    <>
      <Head>
        <title>{`r/${params.slug} - Reddat`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <SubredditHeader slug={params.slug} subreddit={subreddit} />

      <Container sidebar={<Sidebar subreddit={subreddit} slug={params.slug} />}>
        {post ? (
          <>
            <Card post={post} single={true} />
            <Comments post={post} />
          </>
        ) : (
          <>
            <Card isLoading={true} />
          </>
        )}
      </Container>
    </>
  );
};

export default Post;
