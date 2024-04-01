import { withAuth } from "next-auth/middleware"
export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            const isLoggedIn = !!token
            const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
            const isOnAgent = req.nextUrl.pathname.startsWith("/agent");
            if (isOnDashboard || isOnAdmin || isOnAgent) {
                if (isLoggedIn) return true;
                return false
            }
            return true
        }
    }
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};