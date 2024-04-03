import { Search, SlidersHorizontal } from "lucide-react";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import React from "react";

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-ibmplex",
});

export default function Testing() {
  return (
    <div>
      {/* <section className="relative py-10 bg-gray-900  sm:py-16 lg:py-24">
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full "
            src="/assets/house-1.jpg"
            // src="https://cdn.rareblocks.xyz/collection/celebration/images/signup/2/woman-working-laptop.jpg"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gray-900/20"></div>

        <div className="relative max-w-lg px-4 mx-auto sm:px-0">
          <div className="overflow-hidden bg-white rounded-md shadow-md">
            <div className="px-4 py-6 sm:px-8 sm:py-7">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create an account
                </h2>
                <p className="mt-2 text-base text-gray-600">
                  Already joined?{" "}
                  <a
                    href="#"
                    title=""
                    className="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700"
                  >
                    Sign in now
                  </a>
                </p>
              </div>
              
              <form action="#" method="POST" className="mt-8">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor=""
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      First & Last name{" "}
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name=""
                        id=""
                        placeholder="Enter your full name"
                        className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
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
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name=""
                        id=""
                        placeholder="Enter email to get started"
                        className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor=""
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Password{" "}
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="password"
                        name=""
                        id=""
                        placeholder="Enter your password"
                        className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                    >
                      Sign up
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="
                                    relative
                                    inline-flex
                                    items-center
                                    justify-center
                                    w-full
                                    px-4
                                    py-4
                                    text-base
                                    font-semibold
                                    text-gray-700
                                    transition-all
                                    duration-200
                                    bg-white
                                    border-2 border-gray-200
                                    rounded-md
                                    hover:bg-gray-100
                                    focus:bg-gray-100
                                    hover:text-black
                                    focus:text-black focus:outline-none
                                "
                    >
                      <div className="absolute inset-y-0 left-0 p-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                        </svg>
                      </div>
                      Sign up with Google
                    </button>
                  </div>
                </div>
              </form>

              <p className="max-w-xs mx-auto mt-5 text-sm text-center text-gray-600">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="#"
                  title=""
                  className="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700"
                >
                  Privacy Policy
                </a>{" "}
                &
                <a
                  href="#"
                  title=""
                  className="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700"
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
        <div className="absolute inset-0">
          <Image
            fill
            className="object-cover w-full h-full"
            // src="https://cdn.rareblocks.xyz/collection/celebration/images/signin/2/man-eating-noodles.jpg"
            src="/assets/house-1.jpg"
            alt=""
          />
        </div>

        {/* <div className="absolute inset-0 bg-black/90 -z-10"></div> */}
        <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black/80 to-transparent"></div>

        <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

        <article className=" w-full mb-12  border-white/[0.01] lg:border-x lg:py-2 lg:border-y z-30 md:py-0">
          <div className="flex items-center justify-center flex-col mx-auto max-w-7xl w-full px-4 lg:px-6 border-white/[0.03] lg:border-x">
            <div className="flex items-center flex-col my-10 mt-16 lg:mt-10 space-y-6 z-30">
              <p className="text-sm tracking-wide font-semibold uppercase text-white hidden md:block">
                The best way to
              </p>
              <h2
                className={` ${ibmPlex.className} text-center text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white`}
              >
                Find your Dream Home
              </h2>
              <p className="font-medium text-white hidden md:block">
                We&apos;ve more than 75,000 properties listed for you.
              </p>
            </div>
            <div className="max-w-3xl flex items-center justify-center w-full">
              <form className="bg-white rounded-xl p-5 relative w-full flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <input
                  type="search"
                  placeholder=" Enter an address, neighborhood, city, or ZIP code for Buy"
                  className="placeholder:text-[#666] flex-1 ring-[1px] border-0 focus:outline-[#f7f7f7] outline-none ring-[#f6f6f6] py-4 px-5 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-4 w-full"
                />
                <span className="lg:ml-auto px-6 flex gap-4 items-center text-[#4a4a4a]">
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced Search
                </span>
                <div className="p-4 flex lg:items-center gap-x-4 rounded-full bg-[#276ef1]">
                  {/* bg-[#eb6753] */}
                  <Search className="text-white" />
                  <span className="lg:hidden ml-4 text-white font-semibold">
                    Search Property
                  </span>
                </div>
              </form>
            </div>

            {/* <div className="max-w-3xl mt-8 space-y-6 text-lg leading-[1.4] text-gray-200">
            <p>
              <span className="text-gray-50 font-semibold">
                African Real Estate&trade;{" "}
              </span>
              is Africa&apos;s Leading Real Estate company offering the best and
              efficient real estate solutions{" "}
            </p>
            <p>
              Welcome to{" "}
              <span className="text-gray-50 font-semibold">
                African Real Estate
              </span>
            </p>
          </div> */}
          </div>
        </article>
      </section>
      {/* <header>
        <div className="relative bg-black">
          <div className="absolute inset-0">
            <img
              className="object-cover w-full h-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/headers/3/coworking-space.jpg"
              alt=""
            />
          </div>

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative px-4 mx-auto sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16 lg:h-20">
              <div className="flex-shrink-0">
                <a href="#" title="" className="flex">
                  <img
                    className="w-auto h-8 lg:h-10"
                    src="https://cdn.rareblocks.xyz/collection/celebration/images/logo-alt.svg"
                    alt=""
                  />
                </a>
              </div>

              <button
                type="button"
                className="inline-flex p-2 text-white transition-all duration-200 rounded-md lg:hidden focus:bg-gray-800 hover:bg-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>

              <div className="hidden lg:flex lg:items-center lg:space-x-10">
                <a
                  href="#"
                  title=""
                  className="text-base font-medium text-white"
                >
                  {" "}
                  Features{" "}
                </a>

                <a
                  href="#"
                  title=""
                  className="text-base font-medium text-white"
                >
                  {" "}
                  Solutions{" "}
                </a>

                <a
                  href="#"
                  title=""
                  className="text-base font-medium text-white"
                >
                  {" "}
                  Resources{" "}
                </a>

                <a
                  href="#"
                  title=""
                  className="text-base font-medium text-white"
                >
                  {" "}
                  Pricing{" "}
                </a>
              </div>

              <a
                href="#"
                title=""
                className="items-center justify-center hidden px-6 py-3 text-base font-semibold text-black transition-all duration-200 bg-yellow-400 border border-transparent rounded-full lg:inline-flex hover:bg-yellow-500 focus:bg-yellow-500"
                role="button"
              >
                {" "}
                Join Now{" "}
              </a>
            </nav>
          </div>
        </div>

        <nav className="flex flex-col justify-between w-full max-w-xs min-h-screen px-4 py-10 bg-black sm:px-6 lg:hidden">
          <button
            type="button"
            className="inline-flex p-2 text-white transition-all duration-200 rounded-md focus:bg-gray-800 hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col flex-grow h-full">
            <nav className="flex flex-col flex-1 mt-10 space-y-2">
              <a
                href="#"
                title=""
                className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70"
              >
                {" "}
                Features{" "}
              </a>

              <a
                href="#"
                title=""
                className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70"
              >
                {" "}
                Solutions{" "}
              </a>

              <a
                href="#"
                title=""
                className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70"
              >
                {" "}
                Resources{" "}
              </a>

              <a
                href="#"
                title=""
                className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70"
              >
                {" "}
                Pricing{" "}
              </a>
            </nav>

            <div className="flex flex-col items-start">
              <a
                href="#"
                title=""
                className="inline-flex items-center justify-center w-auto px-6 py-3 mt-auto text-base font-semibold text-black transition-all duration-200 bg-yellow-400 border border-transparent rounded-full hover:bg-yellow-500 focus:bg-yellow-500"
                role="button"
              >
                {" "}
                Join Now{" "}
              </a>
            </div>
          </div>
        </nav>
      </header> */}
    </div>
  );
}
