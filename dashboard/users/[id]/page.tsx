import React from "react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import dayjs from "dayjs";

interface SingleUserPageProps {
  params: { id: string };
}

const getUser = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, createdAt: true },
  });
};

export async function generateStaticParams() {
  const allUsers = await prisma.user.findMany();

  return allUsers.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params: { id },
}: SingleUserPageProps) {
  const user = await getUser(id);

  return {
    title: user?.name || `User ${id}`,
  };
}

export default async function SingleUserPage({
  params: { id },
}: SingleUserPageProps) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = await getUser(id);

  return (
    <div className="grid h-screen place-content-center">
      <section className="flex flex-col gap-3 items-center">
        {user?.image && (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        <h2 className="text-center text-xl font-semibold">
          {user?.name || `User ${id}`}
        </h2>
        <p className="text-gray-500 flex items-center gap-1">
          User Since:
          <span>
            {dayjs(user?.createdAt).format("DD MMM YYYY hh:mm A") || ""}
          </span>
        </p>
      </section>
    </div>
  );
}
