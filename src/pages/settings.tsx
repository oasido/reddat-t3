import { NextPage } from "next";
import Head from "next/head";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Settings - Reddat`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />
      <Container>
        <h1 className="text-2xl text-white">User Settings</h1>

        <div className="my-5 border-b-[1px] border-b-zinc-400">
          <h2 className="font-bold text-zinc-400">ACCOUNT PREFERENCES</h2>
        </div>

        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-zinc-200">Email Address</h3>
            <p className="text-zinc-500">fake@email.com</p>
          </div>
          <button className="rounded-3xl border-2 border-zinc-200 p-3.5 py-1 font-medium text-zinc-200">
            Change
          </button>
        </div>
      </Container>
    </>
  );
};

export default Settings;
