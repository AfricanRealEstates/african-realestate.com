import React from "react";
import UserCard from "../../components/UserCard";
import CountChart from "../../components/CountChart";
import ActiveAgentChart from "../../components/ActiveAgentChart";
import FinanceChart from "../../components/FinanceChart";
import EventCalendar from "../../components/EventCalendar";
import Announcements from "../../components/Announcements";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Admin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // If the user is not an admin, return null to prevent the page from rendering
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="agent" />
          <UserCard type="agency" />
          <UserCard type="support" />
          <UserCard type="users" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <ActiveAgentChart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
