import { FadeIn } from "@/components/animations/fade-in";
import { Border } from "@/components/blog/border";
import { MDXComponents } from "@/components/blog/mdx-components";
import { PageLinks } from "@/components/blog/page-links";
import { formatDate } from "@/lib/formatter";
import { Article, MDXEntry, loadArticles } from "@/lib/mdx";
import { Raleway } from "next/font/google";
import Link from "next/link";
import React from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default async function BlogWrapper({
  article,
  children,
}: {
  article: MDXEntry<Article>;
  children: React.ReactNode;
}) {
  let allArticles = await loadArticles();
  let moreArticles = allArticles
    .filter(({ metadata }) => metadata !== article)
    .slice(0, 2);

  return (
    <div className={`text-[#181a20] ${raleway.className}`}>
      <section className="mx-auto w-full max-w-5xl px-5 py-24 md:px-10 md:py-28 lg:py-32">
        <FadeIn>
          <div className="max-w-[770px] mx-auto text-center mb-4">
            <div className="my-5 flex items-center justify-center gap-x-2">
              {article.tags.map((tag) => {
                return (
                  <Link
                    key={tag}
                    href="#"
                    className="inline-flex text-sm text-blue-400 bg-neutral-100 font-medium py-1 px-3 rounded-full mb-1"
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
            <h1 className="font-bold text-2xl sm:text-4xl lg:text-5xl mb-5">
              {article.title}
            </h1>
            <time
              dateTime={article.date}
              className="order-first text-sm text-neutral-500"
            >
              {formatDate(article.date)}
            </time>
            <p className="mt-6 text-sm font-medium text-neutral-600">
              by {article.author.name}, {article.author.role}
            </p>
          </div>
        </FadeIn>
        <Border />
        <FadeIn>
          <MDXComponents.wrapper className="w-full mx-auto mt-10 sm:mt-12 lg:mt-16 prose-lg">
            {children}
          </MDXComponents.wrapper>
        </FadeIn>
      </section>
      {/* <div className="flex max-w-4xl mx-auto justify-between items-center">
        {moreArticles.length > 0 &&
          allArticles.slice(0, 2).map((article) => {
            return (
              <BlogArticle
                key={article.href}
                href={article.href}
                date={article.date}
                title={article.title}
                tags={article.tags}
              />
            );
          })}
      </div> */}

      {/* {moreArticles.length > 0 && (
        <PageLinks
          className="mt-24 sm:mt-32 lg:mt-40"
          title="More articles"
          pages={moreArticles}
        />
      )} */}
    </div>
  );
}

interface Props {
  href: string;
  date: string;
  title: string;
  description?: string;
  tags: string[];
  author?: {
    name: string;
    role: string;
  };
}
const BlogArticle = ({
  href,
  date,
  title,
  tags,
  author,
  description,
}: Props) => {
  return (
    <>
      <Link
        key={href}
        href={`${href}`}
        className="flex flex-col gap-4 rounded-md px-4 py-8 mt-8 md:p-2 no-underline border border-solid border-neutral-50"
      >
        <img
          src={"/assets/blog.svg"}
          className="h-60 inline-block w-full object-cover rounded-md"
        />
        <div className="h-full flex flex-col items-start py-4">
          <div className="flex items-center gap-2">
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="mb-4 rounded-md bg-[#f2f7f7] px-2 py-1.5"
                >
                  <p className="text-xs font-medium capitalize text-[#6574f8]">
                    {tag}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="flex-1 mb-4 text-xl font-bold md:text-2xl text-[#181a20] hover:text-[#6574f8] transition-colors ease-linear">
            {title}
          </p>
          <div className="flex flex-col max-w-lg lg:flex-row items-start">
            <img
              src={"/assets/blog.svg"}
              alt=""
              className="mr-4 inline-block h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col items-start">
              {/* <h6 className="text-sm text-[#181a20]">{author.name}</h6> */}
              <div className="flex flex-col gap-y-2 items-start text-sm text-[#636262]">
                {/* <p>{author.role}</p> */}
                <time className="text-xs" dateTime={date}>
                  {formatDate(date)}
                </time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
