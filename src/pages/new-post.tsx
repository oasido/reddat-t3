import Head from "next/head";
import { NextPage } from "next";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NewPost: NextPage = (props) => {
  const ctx = trpc.useContext();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) {
      router.push("/");
    }
  }, [sessionData]);

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
        <textarea className=" w-full rounded-md border-neutral-700 bg-neutral-800 text-white" />
      </Container>
    </>
  );
};

export default NewPost;
