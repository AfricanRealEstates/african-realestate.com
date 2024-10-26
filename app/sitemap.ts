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

    let additionalPages = [

        {
            url: `${baseUrl}/buy`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/let`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/agent/properties/create-property`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
        },

        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString(),
        },

        {
            url: `${baseUrl}/properties`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/guides`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}`,
            lastModified: new Date().toISOString(),
        },
    ];

    return [
        ...blogs,
        ...routes,
        ...additionalPages,
    ];
}