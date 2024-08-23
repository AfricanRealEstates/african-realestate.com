import React from "react";

export default function Messages() {
  return (
    <section className="px-4 pt-6">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-2xl font-semibold text-blue-600 sm:text-2xl">
          Messages
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Client private messages will be displayed here
        </p>
      </div>
    </section>
  );
}
