import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Container } from "../components/container";
import { Navbar } from "../components/navbar";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sessionData = await getServerAuthSession(context);

  if (sessionData === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

const settingsSchema = z.object({
  email: z.string().email(),
});

const Settings: NextPage<{ sessionData: Session }> = ({ sessionData }) => {
  const INITIAL_SETTINGS = {
    email: sessionData?.user?.email ?? "",
  };
  const [settings, setSettings] =
    useState<z.infer<typeof settingsSchema>>(INITIAL_SETTINGS);

  const [isChanged, setIsChanged] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings({
      email: sessionData?.user?.email ?? "",
    });
  }, [sessionData]);

  useEffect(() => {
    if (settings.email !== sessionData?.user?.email) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [settings, sessionData]);

  const saveSettings = async () => {
    console.log("savesettings");
    return settingsSchema.safeParse(settings);
  };

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
          <div className="w-full">
            <h3 className="text-lg font-medium text-zinc-200">Email Address</h3>
            <input
              className="bg-transparent text-zinc-500"
              value={settings.email ?? "No email saved"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSettings({
                  email: e.target.value,
                })
              }
              ref={emailRef}
            />
          </div>
          <button
            onClick={() => {
              if (emailRef.current !== null) {
                emailRef.current.focus();
              }
            }}
            className="rounded-3xl border-2 border-zinc-200 px-3.5 py-1 font-medium text-zinc-200"
          >
            {sessionData?.user?.email ? "Change" : "Add"}
          </button>
        </div>

        <div className="my-5 flex justify-center gap-2">
          <button
            className={`rounded-3xl border-2 border-zinc-200 px-3.5 py-1 font-medium text-zinc-200`}
            onClick={() => setSettings(INITIAL_SETTINGS)}
          >
            Restore
          </button>
          <button
            onClick={saveSettings}
            className={`rounded-3xl border-2 border-zinc-200 px-3.5 py-1 font-medium text-zinc-200 ${
              isChanged && "cursor-pointer bg-green-500 text-black"
            }`}
            disabled={!isChanged}
          >
            Save
          </button>
        </div>
        {isChanged && (
          <p className="font-medium text-orange-500">Unsaved changes</p>
        )}
      </Container>
    </>
  );
};

export default Settings;
