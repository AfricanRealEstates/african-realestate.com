"use server";
import { RegisterInputProps } from '@/types/types';
import { Resend } from 'resend';
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import EmailTemplate from '@/components/email/email-template';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';

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


export async function upgradeUserRole(role: 'AGENT' | 'AGENCY') {
  try {
    // Get the current user's session
    const user = await getCurrentUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { email: user.email! },
      data: { role: role },
    })

    // Revalidate the current path to reflect the changes
    revalidatePath('/')

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Failed to upgrade user role:', error)
    return { success: false, error: 'Failed to upgrade user role' }
  }
}
