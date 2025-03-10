import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function GeneralInformation() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Extract the first name from the full name
  const firstName = user.name ? user.name.split(" ")[0] : "";
  const lastName = user.name ? user.name.split(" ")[1] : "";

  return (
    <section className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6">
      <h3 className="mb-4 text-xl font-semibold">General information</h3>
      <form>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="first-name"
              defaultValue={firstName}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="last-name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last-name"
              defaultValue={lastName}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              defaultValue={user.email || ""}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="agentName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {user.role == "AGENCY" ? "Agency Name" : "Agent Name"}
            </label>
            <input
              type="text"
              name="agentName"
              defaultValue={user.agentName || ""}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="agentEmail"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {user.role == "AGENCY" ? "Agency Email" : "Agent Email"}
            </label>
            <input
              type="text"
              name="agentEmail"
              defaultValue={user.agentEmail || ""}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>

          {/* {user.role === "AGENCY" && (
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="officeLine"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Office Line
              </label>
              <input
                type="text"
                name="officeLine"
                defaultValue={user.officeLine || ""}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled
              />
            </div>
          )} */}
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="whatsappNumber"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Whatsapp Number
            </label>
            <input
              type="text"
              name="whatsappNumber"
              defaultValue={user.whatsappNumber || ""}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>

          <div className="col-span-full">
            <label
              htmlFor="bio"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              rows={10}
              name="bio"
              defaultValue={user.bio || ""}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>
        </div>
      </form>
    </section>
  );
}
