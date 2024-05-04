import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const q = url.searchParams.get('q')

    if (!q) return new Response('Invalid query', { status: 400 })

    const results = await prisma.property.findMany({
        take: 10
    })

    return new Response(JSON.stringify(results))
}