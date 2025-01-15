import Image from "next/image";
import { Input } from "@/components/ui/input";
import UserAccountNav from "./UserAccountNav";
import { getCurrentUser } from "@/lib/session";
import Breadcrumb from "./BreadcrumbDashboard";
import NotificationIcon from "./NotificationIcon";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const user = await getCurrentUser();
  const notifications = await prisma.notification.findMany({});

  return (
    <div className="sticky top-0 right-0 z-40 flex items-center justify-between bg-white p-4 shadow-sm lg:pl-24">
      <div className="hidden lg:block">
        <Breadcrumb />
      </div>
      <div className="flex w-full items-center justify-end gap-4 lg:gap-6">
        <div className="relative hidden md:block">
          <Input
            type="text"
            placeholder="Search..."
            className="w-[200px] pl-8 pr-4"
          />
          <Image
            src="/assets/search.png"
            alt="Search"
            width={14}
            height={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 transform"
          />
        </div>
        <button
          className="flex size-7 items-center justify-center rounded-full bg-white"
          aria-label="Messages"
        >
          <Image
            src="/assets/message.png"
            width={18}
            height={18}
            alt="message"
          />
        </button>
        <NotificationIcon notifications={notifications} />
        <div className="hidden sm:flex sm:flex-col">
          <span className="text-xs font-medium leading-3">{user?.name}</span>
          <span className="text-right text-[10px] text-rose-500">
            {user?.role}
          </span>
        </div>
        <UserAccountNav />
      </div>
    </div>
  );
}
