import { Raleway } from "next/font/google";
import React from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function FAQs() {
  return (
    <div className={`text-[#181a20] ${raleway.className}`}>
      <section className="mx-auto w-full max-w-7xl px-5 py-24 md:px-10 md:py-32 lg:py-36 bg-neutral-50 mb-16 mt-32 rounded-2xl">
        <div className="mb-8 text-center md:mb-12 lg:mb-16">
          <h2 className="text-3xl font-semibold md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-[528px] text-[#636262]">
            Some of the most asked questions about African Real Estate
          </p>
        </div>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <article className="max-w-[85%] mb-6 rounded-sm border-b-[1px] border-[#c4c4c4] p-8">
            <div className="flex cursor-pointer items-start justify-between">
              <p className="text-xl font-semibold">
                How do I prepare my home before i sell it?
              </p>
              <div className="relative ml-10 flex h-8 w-8 items-center justify-center bg-white">
                <div className="absolute h-4 w-0.5 bg-black"></div>
                <div className="h-0.5 w-4 bg-[#0b0b1f]"></div>
              </div>
            </div>
            <p className="mb-4 text-[#636262] leading-relaxed">
              Before selling your home it is important to prepare it well in
              order to attract potential buyers. Start by decluttering and
              deep-cleaning the home. All of these steps will help you present
              your home in its best light for potential buyers.
            </p>
          </article>
          <article className="max-w-[85%] mb-6 rounded-sm border-b-[1px] border-[#c4c4c4] p-8">
            <div className="flex cursor-pointer items-start justify-between">
              <p className="text-xl font-semibold">
                How long will it take to sell my home?
              </p>
              <div className="relative ml-10 flex h-8 w-8 items-center justify-center bg-white">
                <div className="absolute h-4 w-0.5 bg-black"></div>
                <div className="h-0.5 w-4 bg-[#0b0b1f]"></div>
              </div>
            </div>
            <p className="mb-4 text-[#636262] leading-relaxed">
              The amount of time it takes to sell a home will depend on a
              variety of factors. First, the age of the home is key. Homes that
              are newer or recently renovated tend to sell faster than older
              homes, while some buyers are willing to put in the work to upgrade
              an older home. Second, local market conditions will affect the
              time it takes to sell a home. A robust market favors sellers, as
              homes typically sell quickly.
            </p>
          </article>
          <article className="max-w-[85%] mb-6 rounded-sm border-b-[1px] border-[#c4c4c4] p-8">
            <div className="flex cursor-pointer items-start justify-between">
              <p className="text-xl font-semibold">
                Should I buy a new home before selling my old one?
              </p>
              <div className="relative ml-10 flex h-8 w-8 items-center justify-center bg-white">
                <div className="absolute h-4 w-0.5 bg-black"></div>
                <div className="h-0.5 w-4 bg-[#0b0b1f]"></div>
              </div>
            </div>
            <p className="mb-4 text-[#636262] leading-relaxed">
              You can do it but its typically not recommended to buy a new home
              before selling your old one. Doing so can put you in a precarious
              financial position where you are responsible for two mortgages. It
              is rare for two home sales to line up perfectly, and most buyers
              need to close on their old home before they can move on to the new
              one. Buying a new home before you sell your old one also means
              risking long closing periods and cash-flow issues. If your new
              home takes longer to close than expected and requires short-term
              financing, you may be left in a situation where you need to meet
              two mortgage payments using funds that you haven’t yet collected
              from the sale of your old home. It is very necessary to make sure
              you do not deplete your savings or commit a large portion of your
              income, which may make it very difficult for you to meet other
              financial obligations.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
