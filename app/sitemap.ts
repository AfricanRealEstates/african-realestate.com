import { getBlogPosts } from "@/lib/blog";
// import { getProperties } from "@/lib/properties";
// import { getLocations } from "@/lib/locations";
// import { getPropertyTypes } from "@/lib/propertyTypes";
import { POSTS } from "./(blog)/constants";

export const baseUrl = 'https://www.african-realestate.com'

export default async function sitemap() {
    const blogs = (await getBlogPosts()).map((post) => ({
        url: `${baseUrl}/blog/${post.metadata.category}/${post.slug}`,
        lastModified: new Date(post.metadata.publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
    }));

    // const properties = (await getProperties()).map((property) => ({
    //     url: `${baseUrl}/properties/${property.id}`,
    //     lastModified: new Date(property.updatedAt).toISOString(),
    //     changefreq: 'daily',
    //     priority: 0.9,
    //     images: property.images.map((image) => ({
    //         url: image.url,
    //         caption: image.alt,
    //     })),
    // }));

    // const locations = (await getLocations()).map((location) => ({
    //     url: `${baseUrl}/properties/location/${location.slug}`,
    //     lastModified: new Date().toISOString(),
    //     changefreq: 'weekly',
    //     priority: 0.8,
    // }));

    // const propertyTypes = (await getPropertyTypes()).map((type) => ({
    //     url: `${baseUrl}/properties/type/${type.slug}`,
    //     lastModified: new Date().toISOString(),
    //     changefreq: 'weekly',
    //     priority: 0.8,
    // }));

    const routes = POSTS.map((route) => ({
        url: `${baseUrl}${route.href}`,
        lastModified: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
    }));

    const additionalPages = [
        {
            url: `${baseUrl}`,
            lastModified: new Date().toISOString(),
            changefreq: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/buy`,
            lastModified: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/let`,
            lastModified: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/agent/properties/create-property`,
            lastModified: new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date().toISOString(),
            changefreq: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guides`,
            lastModified: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.6,
        },
    ];

    return [
        // ...properties,
        // ...locations,
        // ...propertyTypes,
        ...blogs,
        ...routes,
        ...additionalPages,
    ];
}