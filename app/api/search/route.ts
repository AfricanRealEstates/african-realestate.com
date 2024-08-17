import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url)
    const q = url.searchParams.get('q')

    if (!q) return new Response('Invalid query', { status: 400 })

    const results = await prisma.property.findMany({
        take: 10
    })

    return new Response(JSON.stringify(results))
}

// export async function GET(req: NextRequest) {
//     try {
//         const user = await getCurrentUser();
//         if (!user) {
//             return Response.json({ error: "Unauthorized" }, { status: 401 })
//         }
//     } catch (error) {
//         console.error(error);
//         return Response.json({ error: "Internal server error" }, { status: 500 })
//     }
// }