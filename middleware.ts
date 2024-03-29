export { default } from 'next-auth/middleware';
export const config = {
    matcher: ["/admin/:path*", "/agent/:path*", "/dashboard/:path*"]
}
