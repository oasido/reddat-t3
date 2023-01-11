import type { GetServerSideProps, NextApiRequest } from "next";
/* import { useRouter } from "next/router"; */
import { Container } from "../../components/container";
import { prisma } from "../../server/db/client";
import { User } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { trpc } from "./../../utils/trpc";

export const getServerSideProps = async (req: NextApiRequest) => {
  try {
    const { username } = req.query;

    if (typeof username !== "string") {
      return {
        props: {
          code: "invalid_url",
          err: "Invalid URL",
        },
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (user === null) {
      return {
        props: {
          err: {
            code: "404",
            err: "User not found.",
          },
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.log(typeof error, error);
    return {
      props: {
        err: {
          code: "500",
          msg: "Internal server error",
        },
      },
    };
  }
};

const UserPage: NextPage<{ user: User }> = ({ user }) => {
  /* const router = useRouter(); */
  /* const { username } = router.query; */

  /* const { data: posts } = trpc.posts.getAll.useQuery(); */

  return (
    <Container>
      <div>
        {user && (
          <Image
            src={
              user.image ??
              `https://api.dicebear.com/5.x/micah/png?seed=${user.id}`
            }
            width={80}
            height={80}
            alt={`${user.name}'s profile picture`}
            className={"rounded-full  border-white p-2"}
          />
        )}
        <h1 className="text-2xl text-white">
          {user ? `${user.name}'s Profile` : `An error has occurred`}
        </h1>
      </div>
      {user && (
        <div className="my-5 border-b-[1px] border-b-gray-400">
          <h2 className="font-bold text-gray-400">Posts</h2>
        </div>
      )}

      <div className=""></div>
    </Container>
  );
};

export default UserPage;
