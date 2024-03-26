import { withAuth } from "next-auth/middleware";
export default withAuth({
    callbacks: {

        authorized: async ({ req, token }) => {
            if (req.nextUrl.pathname.startsWith("/admin")) return token?.role === "ADMIN"
            if (req.nextUrl.pathname.startsWith("/agent")) return token?.role === "AGENT"

            return !!token;
        }
    }

})
export const config = { matcher: ["/dashboard:path*", "/agent:path*", "/admin:path*"] }