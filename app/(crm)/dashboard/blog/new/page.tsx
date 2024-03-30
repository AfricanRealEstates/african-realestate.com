import BlogForm from "@/components/dashboard/blog/blog-form";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard - New Blog",
};

export default function NewBlogPage() {
  return (
    <div className="overflow-y-auto">
      <DashboardTitle title="Add Blog" />
      <BlogForm />
    </div>
  );
}
