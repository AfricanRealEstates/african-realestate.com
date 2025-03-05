import { type NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Create S3 client with proper error handling
let s3Client: S3Client;
try {
  s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
} catch (error) {
  console.error("Error initializing S3 client:", error);
  // We'll handle this in the route handlers
}

export async function POST(request: NextRequest) {
  try {
    // Validate S3 client
    if (!s3Client) {
      throw new Error("S3 client not initialized. Check your AWS credentials.");
    }

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (type !== "profile" && type !== "cover") {
      return NextResponse.json(
        { success: false, error: "Invalid image type" },
        { status: 400 }
      );
    }

    // Process the image
    console.log(`Processing ${type} image for user ${session.user.id}`);
    const buffer = await file.arrayBuffer();
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${type}-${session.user.id}-${Date.now()}.${fileExt}`;

    // Compress the image
    let compressedBuffer;
    try {
      if (type === "profile") {
        compressedBuffer = await sharp(Buffer.from(buffer))
          .resize(400, 400, { fit: "cover" })
          .jpeg({ quality: 90 })
          .toBuffer();
      } else {
        compressedBuffer = await sharp(Buffer.from(buffer))
          .resize(1200, 400, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      }
    } catch (error) {
      console.error("Error processing image:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process image. Please try a different image.",
        },
        { status: 500 }
      );
    }

    // Upload to S3
    console.log(`Uploading to S3: users/${fileName}`);
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${fileName}`,
        Body: compressedBuffer,
        ContentType: "image/jpeg",
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("S3 upload error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to upload to storage. Please check your S3 configuration.",
        },
        { status: 500 }
      );
    }

    // Construct the image URL
    // Use the environment variable if available, otherwise construct from bucket and region
    let imageUrl;
    if (process.env.S3_URL_PREFIX) {
      imageUrl = `${process.env.S3_URL_PREFIX}/users/${fileName}`;
    } else if (process.env.CLOUDFRONT_DOMAIN) {
      imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/users/${fileName}`;
    } else {
      imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/users/${fileName}`;
    }

    console.log(`Image URL: ${imageUrl}`);

    // Update user record
    try {
      if (type === "profile") {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { profilePhoto: imageUrl },
        });
      } else {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { coverPhoto: imageUrl },
        });
      }
    } catch (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to update user record. The image was uploaded but not saved to your profile.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error in upload-image API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Validate S3 client
    if (!s3Client) {
      throw new Error("S3 client not initialized. Check your AWS credentials.");
    }

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "profile" && type !== "cover") {
      return NextResponse.json(
        { success: false, error: "Invalid image type" },
        { status: 400 }
      );
    }

    // Get the current user to find the image URL
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        profilePhoto: type === "profile",
        coverPhoto: type === "cover",
      },
    });

    const imageUrl = type === "profile" ? user?.profilePhoto : user?.coverPhoto;

    if (!imageUrl) {
      return NextResponse.json({
        success: true,
        message: "No image to delete",
      });
    }

    // Extract the file name from the URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "Invalid file URL" },
        { status: 400 }
      );
    }

    // Delete from S3
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${fileName}`,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("S3 delete error:", error);
      // Continue anyway to update the database
    }

    // Update user record
    try {
      if (type === "profile") {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { profilePhoto: null },
        });
      } else {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { coverPhoto: null },
        });
      }
    } catch (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update user record.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete-image API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
