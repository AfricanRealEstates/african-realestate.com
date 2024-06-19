import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import React from "react";

export const metadata = getSEOTags({
  title: "Contact | African Real Estate",
  canonicalUrlRelative: "/contact",
});

export default function Contact() {
  return (
    <>
      <section className="max-w-7xl px-4 md:px-10 py-32 lg:py-36 mx-auto">
        <div className="max-w-3xl mb-10 lg:mb-14">
          <h2 className="font-semibold text-2xl md:text-4xl md:leading-tight text-blue-500">
            Contact us
          </h2>
          <p className="mt-2 text-neutral-400">
            Whatever your inquiry - we will get you there.
          </p>
        </div>

        <article className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
          <div className="md:order-2 border-b border-neutral-100 pb-10 mb-10 md:border-b-0 md:pb-0 md:mb-0">
            <form>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="peer p-4 block w-full bg-neutral-100 border-transparent rounded-lg text-sm text-neutral-500 placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-neutral-400"
                  >
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="peer p-4 block w-full bg-neutral-100 border-transparent rounded-lg text-sm text-neutral-500 placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-neutral-400"
                  >
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="agency"
                    className="peer p-4 block w-full bg-neutral-100 border-transparent rounded-lg text-sm text-neutral-500 placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Agency"
                  />
                  <label
                    htmlFor="agency"
                    className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-neutral-400"
                  >
                    Agency
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    className="peer p-4 block w-full bg-neutral-100 border-transparent rounded-lg text-sm text-neutral-500 placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Phone"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-neutral-400"
                  >
                    Phone
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    className="peer p-6 block w-full bg-neutral-100 border-transparent rounded-lg text-sm text-neutral-500 placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Enter brief message here"
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-neutral-400"
                  >
                    Enter brief message here
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-neutral-500">
                  All fields are required
                </p>

                <p className="mt-5">
                  <a
                    className="group inline-flex items-center gap-x-2 py-3 px-4 bg-blue-500 text-white font-medium text-sm rounded-full focus:outline-none"
                    href="#"
                  >
                    Send a message
                    <svg
                      className="flex-shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-14">
            <div className="flex gap-x-5">
              <svg
                className="flex-shrink-0 size-6 text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              <div className="grow">
                <h4 className="text-neutral-700 font-semibold">Our address:</h4>
                <address className="mt-1 text-neutral-500 text-sm not-italic">
                  Nairobi, Kenya
                </address>
              </div>
            </div>

            <div className="flex gap-x-5">
              <svg
                className="flex-shrink-0 size-6 text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
              </svg>

              <div className="grow">
                <h4 className="text-neutral-700 font-semibold">Email us:</h4>
                <Link
                  className="mt-1 text-neutral-500 text-sm"
                  href="mailto:Africanrealestate0@gmail.com"
                  target="_blank"
                >
                  Africanrealestate0@gmail.com
                </Link>
              </div>
            </div>

            <div className="flex gap-x-5">
              <svg
                className="flex-shrink-0 size-6 text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m3 11 18-5v12L3 14v-3z" />
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
              </svg>
              <div className="grow">
                <h4 className="text-neutral-700 font-semibold">
                  Need property coverage?
                </h4>
                <p className="mt-1 text-neutral-400 text-sm">
                  We&apos;re thrilled to announce that we&apos;re documenting
                  unique and modern architecturial designs that needs exposure.
                </p>
                <p className="mt-2">
                  <a
                    className="group inline-flex items-center gap-x-2 font-medium text-sm text-blue-500 decoration-2 hover:underline underline-offset-8 focus:outline-none focus:underline"
                    href="#"
                  >
                    Advertise
                    <svg
                      className="flex-shrink-0 size-4 transition group-hover:translate-x-0.5  group-focus:translate-x-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
      {/* <section className="px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl bg-gray-100 p-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Contact us
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-500">
              You can reach us through the contact details
            </p>
          </div>

          <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
            <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-3">
              <div className="overflow-hidden bg-white rounded-xl">
                <div className="p-6">
                  <svg
                    className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <p className="mt-6 text-lg font-medium text-gray-900">
                    +254 732945534
                  </p>
                </div>
              </div>

              <div className="overflow-hidden bg-white rounded-xl">
                <div className="p-6">
                  <svg
                    className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-6 text-lg font-medium text-gray-900">
                    Africanrealestate0@gmail.com
                  </p>
                </div>
              </div>

              <div className="overflow-hidden bg-white rounded-xl">
                <div className="p-6">
                  <svg
                    className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="mt-6 text-lg font-medium leading-relaxed text-gray-900">
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden bg-white rounded-xl">
              <div className="px-6 py-12 sm:p-12">
                <h3 className="text-3xl font-semibold text-center text-gray-900">
                  Send us a message
                </h3>

                <form action="#" method="POST" className="mt-14">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label
                        htmlFor=""
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Your name{" "}
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="Enter your full name"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor=""
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Email address{" "}
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="email"
                          name=""
                          id=""
                          placeholder="Enter your full name"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor=""
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Phone number{" "}
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="tel"
                          name=""
                          id=""
                          placeholder="Enter your full name"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor=""
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Company name{" "}
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="Enter your full name"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor=""
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Message{" "}
                      </label>
                      <div className="mt-2.5 relative">
                        <textarea
                          name=""
                          id=""
                          placeholder=""
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md resize-y focus:outline-none focus:border-blue-600 caret-blue-600"
                        ></textarea>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-24 gap-y-10">
            <div>
              <img
                className="object-cover w-16 h-16 rounded-full"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/cta/9/female-avatar-1.png"
                alt=""
              />
              <blockquote>
                <p className="mt-6 text-xl leading-relaxed text-black">
                  “African Real Estate is the property solution that I thought I
                  didn&apos;t need. Suprise! I am relieved I came across this
                  platform. It has really helped me to sell my property while
                  letting others with ease.”
                </p>
              </blockquote>
              <p className="mt-6 text-base font-semibold text-black">
                Jenny Wilson
              </p>
              <p className="mt-1 text-base text-gray-600">
                Project Manager at Kiuga
              </p>
            </div>

            <div>
              <div className="overflow-hidden bg-white">
                <div className="p-8 lg:px-12 lg:py-10">
                  <h3 className="text-2xl font-semibold text-black">
                    Join 1,482 other agents
                  </h3>
                  <p className="mt-4 text-base text-gray-600">
                    Sign up for free and start selling your properties on
                    African Real Estate today. Our easy process will help you
                    get started in no time.
                  </p>

                  <Link
                    href="/agent/properties/create-property"
                    title="sell"
                    className="flex items-center justify-center w-full px-4 py-4 mt-8 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border-2 border-transparent rounded-md hover:bg-blue-700 focus:bg-blue-700"
                    role="button"
                  >
                    Create your first listing
                  </Link>

                  <Link
                    href="/contact"
                    title="contact"
                    className="flex items-center justify-center w-full px-4 py-4 mt-4 text-base font-semibold text-black transition-all duration-200 bg-transparent border-2 border-black rounded-md hover:bg-black focus:bg-black hover:text-white focus:text-white"
                    role="button"
                  >
                    Talk to sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
