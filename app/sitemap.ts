import { getBlogPosts } from "@/lib/blog";
import { POSTS } from "./(blog)/constants";

export const baseUrl = 'https://www.african-realestate.com'

export default async function sitemap() {
    let blogs = (await getBlogPosts()).map((post) => ({
        url: `${baseUrl}/blog/${post.metadata.category}/${post.slug}`,
        lastModified: new Date(post.metadata.publishedAt).toISOString(),
    }));

    let routes = POSTS.map((route) => ({
        url: `${baseUrl}${route.href}`,
        lastModified: new Date().toISOString(),
    }));

    return [...blogs, ...routes];
}