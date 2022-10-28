// 404.js
import Head from "next/head";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import Link from "next/link";

const FourOhFour = () => {
  return (
    <>
      <Head>
        <title>{`Reddat - 404`}</title>
        <meta name="description" content="Reddat: A Reddit Clone by oasido" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Navbar />

      <Container>
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <h1 className="text-7xl font-bold text-white">404</h1>
          <h3 className="text-center text-xl text-white">
            Weelps! We couldn&apos;t find that page.
          </h3>
          <h4 className="mt-5 text-center text-white">
            If you think this is an error, please contact
            <a
              href="https://github.com/oasido"
              target="_blank"
              rel="noreferrer"
              className="font-600 mx-2 text-blue-200 hover:underline"
            >
              github.com/oasido
            </a>
          </h4>
          <div className="my-8">
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

export default FourOhFour;
