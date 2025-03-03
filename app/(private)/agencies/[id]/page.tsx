import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { capitalizeWords } from "@/lib/utils";
import NotFound from "@/app/not-found";
import { formatDate } from "date-fns";
import Avatar from "@/components/globals/avatar";
import { Raleway } from "next/font/google";
import { Mail } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

interface AgentDetailsProps {
  params: {
    id: string;
  };
}

interface PropertyData {
  id: string;
  title: string;
  status: string;
  // Add other property fields as needed
}

export async function generateMetadata({
  params: { id },
}: AgentDetailsProps): Promise<Metadata> {
  const agent = await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: agent
      ? `${capitalizeWords(agent.name!)} Properties | African Real Estate`
      : "Agent Not Found",
  };
}

export default async function AgentDetails({
  params: { id },
}: AgentDetailsProps) {
  const agent = await prisma.user.findUnique({
    where: { id },
    include: {
      properties: {
        where: {
          isActive: true, // Only fetch active properties
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  if (!agent) {
    return <NotFound />;
  }

  const saleProperties = agent.properties.filter(
    (property) => property.status === "sale"
  );
  const letProperties = agent.properties.filter(
    (property) => property.status === "let"
  );

  const renderSidebar = () => {
    return (
      <div
        className={`${raleway.className} w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8`}
      >
        <Avatar
          hasChecked
          hasCheckedClass="w-6 h-6 -top-0.5 right-2"
          sizeClass="w-28 h-28"
          imgUrl={agent.image}
        />

        {agent?.name ? (
          <div className="space-y-3 text-center flex flex-col items-center">
            <h2 className="text-xl text-indigo-500 font-semibold">
              {agent.role === "AGENCY" ? (
                <>
                  {agent?.name} - {agent.agentName}
                </>
              ) : (
                <>{agent?.name}</>
              )}
            </h2>
          </div>
        ) : (
          <p className="text-neutral-500">No agent yet</p>
        )}

        <div className="border-b border-neutral-50 w-full"></div>

        <p className="text-neutral-500 font-semibold">Bio</p>
        {agent?.bio ? (
          <p className={`text-neutral-500 text-left text-sm`}>
            {agent.bio.length > 250
              ? `${agent.bio.substring(0, 250)}...`
              : agent.bio}
          </p>
        ) : (
          <p className="text-neutral-500">No bio yet</p>
        )}

        <div className="border-b border-neutral-50  w-full"></div>

        <div className="!space-x-3 flex items-center justify-center">
          {agent.facebookLink && (
            <Link
              href={agent.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebook />
              </p>
            </Link>
          )}
          {agent.tiktokLink && (
            <Link
              href={agent.tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-black hover:text-white transition-colors">
                <FaTiktok />
              </p>
            </Link>
          )}
          {agent.youtubeLink && (
            <Link
              href={agent.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-red-600 hover:text-white transition-colors">
                <FaYoutube />
              </p>
            </Link>
          )}
          {agent.instagramLink && (
            <Link
              href={agent.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-red-600 hover:text-white transition-colors">
                <FaInstagram />
              </p>
            </Link>
          )}
          {agent.linkedinLink && (
            <Link
              href={agent.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-blue-700 hover:text-white transition-colors">
                <FaLinkedin />
              </p>
            </Link>
          )}
        </div>

        <div className="border-b border-neutral-50 w-full"></div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-neutral-400" />
            <Link
              href={`mailto:${agent.email}`}
              className="text-neutral-600 hover:text-indigo-500 transition-colors"
            >
              Talk to {agent.role}
            </Link>
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
    <>
      <div
        className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
      >
        <div className="mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
          <div className="block flex-grow mb-24 lg:mb-0">
            <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
          </div>
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
            <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8">
              <div>
                <h2 className="text-2xl text-indigo-500 font-semibold">
                  {agent.role === "AGENCY" ? agent.agentName : agent.name}{" "}
                  listings
                </h2>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {agent.role === "AGENCY" ? agent.agentName : agent.name}
                  {agent.role === "AGENT"
                    ? agent.agentName
                    : `${capitalizeWords(agent.name!)}`}
                  &apos;s listings are very rich, and 5-star reviews help them
                  to be more branded.
                </span>
              </div>

              <div className="w-full border-b border-neutral-100"></div>

              <Tabs defaultValue="sale" className="w-full">
                <TabsList>
                  <TabsTrigger value="sale">
                    For Sale ({saleProperties.length})
                  </TabsTrigger>
                  <TabsTrigger value="let">
                    To Let ({letProperties.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sale">
                  <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                    {saleProperties.map((property) => (
                      <PropertyCard key={property.id} data={property as any} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="let">
                  <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                    {letProperties.map((property) => (
                      <PropertyCard key={property.id} data={property as any} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
