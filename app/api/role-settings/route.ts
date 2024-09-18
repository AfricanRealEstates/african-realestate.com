import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export async function GET(req: Request) {
//     const session = await auth()
//     const currentUser = session?.user

//     if (!currentUser) {
//         redirect('/login')
//     }

//     let userRole = await prisma.user.findUnique({
//         where: { id: currentUser.id },
//     })

//     if (!userRole) {
//         userRole = await prisma.user.create({
//             data: {
//                 id: currentUser.id,
//                 role: "AGENT",
//             }
//         })
//     }

//     revalidatePath("/agent/properties/create-property")

//     return Response.json(userRole)
// }