import Head from "next/head";
import { Container } from "../../container";
import { Navbar } from "../../navbar";
import { SlugType } from "../../../pages/r/[slug]";
import Link from "next/link";

export const SubredditNotFound = ({ slug }: SlugType): JSX.Element => {
  return (
    <>
      <Head>
        <title>{`r/${slug} - Reddat`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <Container>
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <div className="my-5 mr-3 h-20 w-20 rounded-full border-4 border-white bg-gray-500" />
          <h3 className="text-lg text-white">
            There {`aren't`} any communities with that name.
          </h3>
          <h4 className="text-center text-white">
            This community may have been banned or the community name may be
            incorrect.
          </h4>
          <div className="my-8">
            <button className="mx-2 rounded-xl border-2 border-white px-3 py-0.5 text-sm font-[600] text-white hover:bg-neutral-500/10">
              Create Community
            </button>
            <Link href="/">
              <button className="mx-2 rounded-xl border-2 bg-gray-300 px-3 py-0.5 text-sm font-[600] hover:bg-gray-100">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};
