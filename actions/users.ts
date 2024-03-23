"use server";
import { RegisterInputProps } from '@/types/types';
import { Resend } from 'resend';
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import EmailTemplate from '@/components/email/email-template';

export async function createUser(data: RegisterInputProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { fullName, email, role = "USER", password } = data;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        data: null,
        error: `User with this (${email}) already exists`
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const generateToken = () => {
      const min = 100000 // Minimum 6-figure number
      const max = 999999 // Maximum 6-figure number
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const userToken = generateToken();
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        role,
        token: userToken
      }
    })

    const token = newUser.token;
    const userId = newUser.id;
    const firstName = newUser.name?.split(' ')[0];
    const linkText = "Verify your Account ";
    const message =
      "Thank you for registering with Kiuga. To complete your registration and verify your email address, please enter the following 6-digit verification code on our website :";
    const sendMail = await resend.emails.send({
      // from: "Kiuga.com <kenmwangi071@gmail.com>",
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your Email Address",
      react: EmailTemplate({ firstName, token, linkText, message })
    });
    console.log(token);
    console.log(sendMail);
    console.log(newUser);

    return {
      data: newUser,
      error: null,
      status: 200
    }
  } catch (error) {
    return {
      error: "Something went wrong"
    }
  }
}

export async function getUserById(id: string) {
  if (id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      })
      return user
    } catch (error) {
      console.log(error)
    }
  }
}

export async function updateUserById(id: string) {
  if (id) {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id
        },
        data: {
          isVerified: true
        }
      })
      return updatedUser
    } catch (error) {
      console.log(error)
    }
  }
}

// "use server";
// import { currentUser } from "@clerk/nextjs";
// import prisma from "@/lib/prisma";

// export const getCurrentUser = async () => {
//   try {
//     // Check if user already exists with clerk userId property
//     const clerkUser = await currentUser();
//     let savedUser = null;
//     savedUser = await prisma.user.findUnique({
//       where: {
//         clerkUserId: clerkUser?.id,
//       },
//     });

//     if (savedUser) {
//       return {
//         data: savedUser,
//       };
//     }

//     // if user does not exists, create new user

//     let username = clerkUser?.username;
//     if (!username) {
//       username = `${clerkUser?.firstName} ${clerkUser?.lastName}`;
//     }
//     username = username.replace("null", "");
//     const newUser: any = {
//       clerkUserId: clerkUser?.id,
//       username: username,
//       email: clerkUser?.emailAddresses[0].emailAddress,
//       profilePic: clerkUser?.imageUrl,
//     };
//     const user = await prisma.user.create({
//       data: newUser,
//     });
//     return { data: user };
//   } catch (error: any) {
//     console.log(error);
//     return {
//       error: error.message,
//     };
//   }
// };
