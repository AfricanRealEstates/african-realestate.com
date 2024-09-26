export { auth as middleware } from '@/auth';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


// import { NextResponse } from 'next/server'
// import { auth } from './auth'

// export default auth((req) => {
//   const { nextUrl } = req
//   const isLoggedIn = !!req.auth
//   const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')
//   const isProtectedPage = !nextUrl.pathname.startsWith('/api') && 
//                           !nextUrl.pathname.startsWith('/_next') && 
//                           !isAuthPage

//   if (isAuthPage) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(nextUrl.searchParams.get('callbackUrl') || '/dashboard', nextUrl))
//     }
//     return null
//   }

//   if (isProtectedPage && !isLoggedIn) {
//     const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
//     return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
//   }

//   return null
// })

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }