// import { AuthOptions, NextAuthOptions } from "next-auth";
// // import { PrismaAdapter } from "@auth/prisma-adapter";

// import {prisma} from "@/lib/prisma";

// import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
// import type { Adapter } from "next-auth/adapters";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcrypt";

// export const authOptions: NextAuthOptions = {
//     adapter: PrismaAdapter(prisma) as Adapter,
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/login",
//     },
//     providers: [
//         EmailProvider({
//             server: process.env.GMAIL_EMAIL_SERVER || "", // any SMTP server will work
//             from: process.env.EMAIL_FROM || "",
//             // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
//         }),
//         GoogleProvider({
//             //Checking if the role exista and if not add USER Bydefault
//             // profile(profile) {
//             //     return { role: profile.role ?? "USER", ...profile };
//             // },
//             clientId: process.env.GOOGLE_CLIENT_ID || "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//             allowDangerousEmailAccountLinking: true

//         }),
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email", placeholder: "john.doe@email.com" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 try {
//                     console.log(
//                         "Authorize function called with credentials:",
//                         credentials
//                     );
//                     // Check if user credentials are Correct
//                     if (!credentials?.email || !credentials?.password) {
//                         throw { error: "No Inputs Found", status: 401 };
//                     }
//                     console.log("Pass 1 checked ");
//                     //Check if user exists
//                     const existingUser = await prisma.user.findUnique({
//                         where: { email: credentials.email },
//                     });

//                     if (!existingUser) {
//                         console.log("No user found");
//                         throw { error: "No user found", status: 401 };
//                     }

//                     console.log("Pass 2 Checked");
//                     console.log(existingUser);
//                     let passwordMatch: boolean = false;
//                     //Check if Password is correct
//                     if (existingUser && existingUser.password) {
//                         // if user exists and password exists
//                         passwordMatch = await compare(
//                             credentials.password,
//                             existingUser.password
//                         );
//                     }
//                     if (!passwordMatch) {
//                         console.log("Password incorrect");
//                         throw { error: "Password Incorrect", status: 401 };
//                     }
//                     console.log("Pass 3 Checked");
//                     const user = {
//                         id: existingUser.id,
//                         name: existingUser.name,
//                         email: existingUser.email,
//                         role: existingUser.role,
//                         permissions: existingUser.permissions,
//                         createdAt: existingUser.createdAt,
//                         isActive: existingUser.isActive
//                     };
//                     //
//                     console.log("User Compiled");
//                     console.log(user);
//                     return user;
//                 } catch (error) {
//                     console.log("All Failed");
//                     console.log(error);
//                     throw { error: "Something went wrong", status: 401 };
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user }) {
//             const dbUser = await prisma.user.findFirst({
//                 where: { email: token?.email ?? "" },
//             });
//             if (!dbUser) {
//                 token.id = user!.id;
//                 return token;
//             }
//             return {
//                 id: dbUser.id,
//                 name: dbUser.name,
//                 email: dbUser.email,
//                 role: dbUser.role,
//                 permissions: dbUser.permissions,
//                 picture: dbUser.image,
//             };
//         },
//         session({ session, token }) {
//             if (token && session.user) {
//                 session.user.id = token.id;
//                 session.user.name = token.name;
//                 session.user.email = token.email;
//                 session.user.image = token.picture;
//                 session.user.role = token.role;
//                 session.user.permissions = token.permissions;


//             }
//             return session;
//         },
//     },
// };