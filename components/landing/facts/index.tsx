import { Josefin_Sans, Lexend, Raleway } from "next/font/google";
import Image from "next/image";
import React from "react";
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
export default function Facts() {
  return (
    <section className="relative py-10 overflow-hidden bg-black lg:py-28">
      <div className="absolute inset-0">
        <Image
          fill
          className="object-cover w-full h-full md:object-left md:scale-150 md:origin-top-left"
          src="/assets/fact.jpg"
          alt="fact"
        />
      </div>

      <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black to-transparent"></div>

      <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

      <section className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <h2
          className={`text-center tracking-tight text-white text-3xl font-bold md:text-4xl mb-12 ${lexend.className}`}
        >
          Backed up by real data
        </h2>
        <div className="mx-auto flex w-full flex-col rounded-[16px] bg-[#ffffff4a] py-8 text-white">
          <div className="grid h-full w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d]">
              <h4 className="mb-4 text-4xl font-bold md:text-5xl">200+</h4>
              <p className="text-lg text-[#bebdbd]">Agents</p>
            </div>
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d] ">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">7000+</h4>
              <p className="text-lg text-[#bebdbd]">Properties</p>
            </div>
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d] ">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">1200+</h4>
              <p className="text-lg text-[#bebdbd]">Satisfied Customers</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">4.9</h4>
              <p className="text-lg text-[#bebdbd]">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center md:w-2/3 lg:w-1/2 xl:w-1/3 md:text-left">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Get full access to Celebration
          </h2>
          <p className="mt-4 text-base text-gray-200">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam.
          </p>

          <form action="#" method="POST" className="mt-8 lg:mt-12">
            <div className="flex flex-col items-center sm:flex-row sm:justify-center">
              <div className="flex-1 w-full min-w-0 px-4 sm:px-0">
                <div className="relative text-gray-400 focus-within:text-gray-600">
                  <label htmlFor="email" className="sr-only"></label>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    className="block w-full py-4 pl-10 pr-4 text-base text-black placeholder-gray-500 transition-all duration-200 border-gray-200 rounded-md sm:rounded-r-none caret-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center flex-shrink-0 w-auto px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md sm:mt-0 sm:rounded-l-none sm:w-auto hover:bg-blue-700 focus:bg-blue-700"
              >
                Get instant access
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </section>
  );
}
