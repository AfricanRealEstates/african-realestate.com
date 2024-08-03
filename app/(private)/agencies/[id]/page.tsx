import { auth } from "@/auth";
import Avatar from "@/components/globals/avatar";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import { Mail } from "lucide-react";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import { redirect } from "next/navigation";
import RenderSection1 from "../_components/Properties";
import { FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import NotFound from "@/app/not-found";
import dayjs from "dayjs";
import { capitalizeWords } from "@/lib/utils";
import { formatDate } from "date-fns";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

interface SingleAgencyProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params: { id },
}: SingleAgencyProps): Promise<Metadata> {
  const agent = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      properties: true,
    },
  });

  return {
    title: `${capitalizeWords(agent?.name!)}'s Listings | African Real Estate`,
  };
}

export default async function SingleAgency({
  params: { id },
}: SingleAgencyProps) {
  const session = await auth();
  const user = session?.user;

  // if (!user) {
  //   redirect("/login");
  // }

  const agent = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      properties: true,
    },
  });

  if (!agent) {
    return <NotFound />;
  }

  // Fetch specific user properties
  const properties: Property[] = await prisma.property.findMany({
    where: {
      userId: agent.id, // Filter properties by the user's ID
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: true, // Include user data if needed
    },
  });

  console.log(properties);

  const renderSidebar = () => {
    return (
      <div className=" w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
        <Avatar
          hasChecked
          hasCheckedClass="w-6 h-6 -top-0.5 right-2"
          sizeClass="w-28 h-28"
          imgUrl={agent.image}
        />

        {/* ---- */}
        {agent?.name ? (
          <div className="space-y-3 text-center flex flex-col items-center">
            <h2 className="text-xl text-indigo-500 font-semibold">
              {agent?.name}
            </h2>
            {/* <StartRating className="!text-base" /> */}
          </div>
        ) : (
          <p className="text-neutral-500">No agent yet</p>
        )}

        <div className="border-b border-neutral-50 w-full"></div>

        {/* ---- */}
        {agent?.bio ? (
          <p className="text-neutral-500">
            {agent.bio.length > 250
              ? `${agent.bio.substring(0, 250)}...`
              : agent.bio}
          </p>
        ) : (
          <p className="text-neutral-500">No bio yet</p>
        )}

        <div className="border-b border-neutral-50  w-full"></div>

        {/* ---- */}
        <div className="!space-x-3 flex items-center justify-center">
          <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl">
            <FaFacebook />
          </p>
          <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl">
            <FaTiktok />
          </p>
          <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl">
            <FaYoutube />
          </p>
          <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl">
            <FaLinkedin />
          </p>
        </div>

        {/* ---- */}
        <div className="border-b border-neutral-50 w-full"></div>

        {/* ---- */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-neutral-400" />
            <span className="text-neutral-600">{agent.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span className="text-neutral-600">Replies Fast</span>
          </div>

          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-neutral-600">
              Member since {formatDate(agent.createdAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <div className="mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="block flex-grow mb-24 lg:mb-0">
          <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
        </div>
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
          <RenderSection1 properties={properties} agent={agent} />
        </div>
      </div>
    </div>
  );
}
