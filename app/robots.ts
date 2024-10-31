import { baseUrl } from "./sitemap"

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/private/',
                    '*/login',
                    '*/signup',
                    '/agent/properties/create-property',
                    '/*.json$',
                    '/*?*', // Disallow URLs with query parameters
                ],
            },
            {
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                userAgent: 'CCBot',
                disallow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}