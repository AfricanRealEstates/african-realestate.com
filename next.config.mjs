import rehypeShiki from "@leafac/rehype-shiki";
import nextMDX from "@next/mdx";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { recmaImportImages } from "recma-import-images";
import { remarkRehypeWrap } from "remark-rehype-wrap";
import shiki from "shiki";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "dw1utqy4bbv8r.cloudfront.net",
      },
      {
        hostname: "african-real-estate-photos.s3.amazonaws.com",
      },
      {
        hostname: "4muw4qkgpimyciou.public.blob.vercel-storage.com",
      },
      {
        hostname: "firebasestorage.googleapis.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatar.vercel.sh",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "african-real-estate-photos.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],

    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
};

function remarkMDXLayout(source, metaName) {
  let parser = Parser.extend(jsx());
  let parseOptions = { ecmaVersion: "latest", sourceType: "module" };

  return (tree) => {
    let imp = `import _Layout from '${source}'`;
    let exp = `export default function Layout(props) {
      return <_Layout {...props} ${metaName}={${metaName}} />
    }`;

    tree.children.push(
      {
        type: "mdxjsEsm",
        value: imp,
        data: { estree: parser.parse(imp, parseOptions) },
      },
      {
        type: "mdxjsEsm",
        value: exp,
        data: { estree: parser.parse(exp, parseOptions) },
      }
    );
  };
}

export default async function config() {
  let highlighter = await shiki.getHighlighter({
    theme: "css-variables",
  });

  let withMDX = nextMDX({
    extension: /\.mdx$/,
    options: {
      recmaPlugins: [recmaImportImages],
      rehypePlugins: [
        [rehypeShiki, { highlighter }],
        [
          remarkRehypeWrap,
          {
            node: { type: "mdxJsxFlowElement", name: "Typography" },
            start: ":root > :not(mdxJsxFlowElement)",
            end: ":root > mdxJsxFlowElement",
          },
        ],
      ],
      // remarkPlugins: [
      //   remarkGfm,
      //   remarkUnwrapImages,
      //   [
      //     unifiedConditional,
      //     [
      //       new RegExp(`^${escapeStringRegexp(path.resolve("app/blog"))}`),
      //       [[remarkMDXLayout, "@/app/blog/wrapper", "article"]],
      //     ],
      //     [
      //       new RegExp(`^${escapeStringRegexp(path.resolve("app/work"))}`),
      //       [[remarkMDXLayout, "@/app/work/wrapper", "caseStudy"]],
      //     ],
      //   ],
      // ],
    },
  });

  return withMDX(nextConfig);
}
