// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const { q } = req.query;

            if (typeof q !== "string") {
                return res.status(400).json({ message: "Invalid query" });
            }

            const properties = await prisma.property.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } },
                        { county: { contains: q, mode: "insensitive" } },
                        { nearbyTown: { contains: q, mode: "insensitive" } },
                        { user: { name: { contains: q, mode: "insensitive" } } },
                    ],
                },
                include: {
                    user: true,
                },
                take: 5, // Limit to 5 results for the autocomplete
            });

            return res.status(200).json(properties);
        } catch (error) {
            console.error("Search error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}