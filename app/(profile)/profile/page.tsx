import React from "react";
import LeftMenu from "../_components/LeftMenu";
import RightMenu from "../_components/RightMenu";
import Stories from "../_components/Stories";
import AddPost from "../_components/AddPost";
import Feed from "../_components/Feed";

export default function Profile() {
  return (
    <main className="bg-neutral-50 py-32 max-w-7xl mx-auto px-4 lg:px-8">
      <section className="flex gap-6 pt-6">
        <div className="hidden xl:block w-[20%]">
          <LeftMenu />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <Stories />
            <AddPost />
            <Feed />
          </div>
        </div>
        <div className="hidden lg:block w-[30%]">
          <RightMenu />
        </div>
      </section>
    </main>
  );
}
