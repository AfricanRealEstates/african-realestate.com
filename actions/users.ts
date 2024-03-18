"use server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export const getCurrentUser = async () => {
  try {
    // Check if user already exists with clerk userId property
    const clerkUser = await currentUser();
    let savedUser = null;
    savedUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser?.id,
      },
    });

    if (savedUser) {
      return {
        data: savedUser,
      };
    }

    // if user does not exists, create new user

    let username = clerkUser?.username;
    if (!username) {
      username = `${clerkUser?.firstName} ${clerkUser?.lastName}`;
    }
    username = username.replace("null", "");
    const newUser: any = {
      clerkUserId: clerkUser?.id,
      username: username,
      email: clerkUser?.emailAddresses[0].emailAddress,
      profilePic: clerkUser?.imageUrl,
    };
    const user = await prisma.user.create({
      data: newUser,
    });
    return { data: user };
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};
