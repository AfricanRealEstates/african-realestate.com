import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

// Token types
export const VERIFICATION_TOKEN = "VERIFICATION";
export const PASSWORD_RESET_TOKEN = "PASSWORD_RESET";
export const INVITE_TOKEN = "INVITE";

// Generate a random token
export function generateToken() {
  return uuidv4();
}

// Create a verification token
export async function createVerificationToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: { startsWith: VERIFICATION_TOKEN } },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: { identifier: email, token: existingToken.token },
      },
    });
  }

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: `${VERIFICATION_TOKEN}_${token}`,
      expires,
    },
  });

  return token;
}

// Create a password reset token
export async function createPasswordResetToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: { startsWith: PASSWORD_RESET_TOKEN } },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: { identifier: email, token: existingToken.token },
      },
    });
  }

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: `${PASSWORD_RESET_TOKEN}_${token}`,
      expires,
    },
  });

  return token;
}

// Create an invite token
export async function createInviteToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: { startsWith: INVITE_TOKEN } },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: { identifier: email, token: existingToken.token },
      },
    });
  }

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: `${INVITE_TOKEN}_${token}`,
      expires,
    },
  });

  return token;
}

// Verify a token
export async function verifyToken(
  identifier: string,
  tokenType: string,
  tokenValue: string
) {
  const fullToken = `${tokenType}_${tokenValue}`;

  const token = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token: fullToken } },
  });

  if (!token) {
    return { success: false, error: "Token not found" };
  }

  if (token.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token: fullToken } },
    });
    return { success: false, error: "Token expired" };
  }

  // Delete the token after verification (one-time use)
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token: fullToken } },
  });

  return { success: true };
}
