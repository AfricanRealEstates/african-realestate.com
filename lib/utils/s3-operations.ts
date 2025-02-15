import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3-client";

// Helper function to safely access environment variables
const getEnvVar = (key: string): string => {
  if (typeof window === "undefined") {
    // Server-side
    return process.env[key] || "";
  }
  // Client-side
  return process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "";
};

interface S3OperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export async function uploadToS3(
  file: File,
  key: string
): Promise<S3OperationResult> {
  if (!s3Client) {
    return {
      success: false,
      message: "S3 client is not initialized due to missing configuration",
    };
  }
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  if (!bucketName) {
    return { success: false, message: "S3 bucket name is not set" };
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
      StorageClass: "STANDARD", // 👈 Ensures it's not stored in Glacier
    });

    await s3Client.send(command);

    const fileUrl = `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    return {
      success: true,
      message: "File uploaded successfully",
      data: { fileUrl },
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return { success: false, message: "Failed to upload file" };
  }
}

export async function deleteFromS3(key: string): Promise<S3OperationResult> {
  if (!s3Client) {
    return {
      success: false,
      message: "S3 client is not initialized due to missing configuration",
    };
  }
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  if (!bucketName) {
    return { success: false, message: "S3 bucket name is not set" };
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { success: false, message: "Failed to delete file" };
  }
}

export async function getSignedDownloadUrl(
  key: string
): Promise<S3OperationResult> {
  if (!s3Client) {
    return {
      success: false,
      message: "S3 client is not initialized due to missing configuration",
    };
  }
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  if (!bucketName) {
    return { success: false, message: "S3 bucket name is not set" };
  }
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return {
      success: true,
      message: "Signed URL generated successfully",
      data: { url },
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { success: false, message: "Failed to generate signed URL" };
  }
}

export async function checkFileExists(key: string): Promise<boolean> {
  if (!s3Client) {
    return false;
  }
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  if (!bucketName) {
    return false;
  }
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    if ((error as any).name === "NoSuchKey") {
      return false;
    }
    throw error;
  }
}
