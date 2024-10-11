import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Redis } from "@upstash/redis";
import prisma from './prisma';

const redis = Redis.fromEnv();

export type BlogPost = {
    slug: string;
    metadata: {
        title: string;
        publishedAt: string;
        summary: string;
        author: string;
        category: string;
        image: string;
        cover: string;
    };
    content: string;
    views: number;
    likes: number;
};

function getMDXFiles(dir: string): string[] {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string): { data: any; content: string } {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return matter(rawContent);
}

async function getMDXData(dir: string): Promise<BlogPost[]> {
    const mdxFiles = getMDXFiles(dir);

    const posts = await Promise.all(
        mdxFiles.map(async (file) => {
            const { data: metadata, content } = readMDXFile(path.join(dir, file));
            const slug = path.basename(file, path.extname(file));
            const views = await redis.get<number>(
                ["pageviews", "posts", slug].join(":")
            );
            const likes = await prisma.blogPost.findUnique({
                where: { slug },
                select: { likes: true },
            });

            return {
                metadata: metadata as BlogPost["metadata"],
                slug,
                content,
                views: views ?? 0,
                likes: likes?.likes ?? 0,
            };
        })
    );

    return posts;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const posts = await getMDXData(
        path.join(process.cwd(), "app", "(blog)", "blog", "contents")
    );
    return posts.sort(
        (a, b) =>
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
    );
}

export function formatDate(date: string, includeRelative = false): string {
    const currentDate = new Date();
    const targetDate = new Date(date);

    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diffInSeconds = (currentDate.getTime() - targetDate.getTime()) / 1000;

    let relativeTime: string;
    if (diffInSeconds < 60) {
        relativeTime = formatter.format(-Math.round(diffInSeconds), "second");
    } else if (diffInSeconds < 3600) {
        relativeTime = formatter.format(-Math.round(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
        relativeTime = formatter.format(-Math.round(diffInSeconds / 3600), "hour");
    } else if (diffInSeconds < 2592000) {
        relativeTime = formatter.format(-Math.round(diffInSeconds / 86400), "day");
    } else if (diffInSeconds < 31536000) {
        relativeTime = formatter.format(
            -Math.round(diffInSeconds / 2592000),
            "month"
        );
    } else {
        relativeTime = formatter.format(
            -Math.round(diffInSeconds / 31536000),
            "year"
        );
    }

    const fullDate = targetDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return includeRelative ? `${fullDate} (${relativeTime})` : fullDate;
}