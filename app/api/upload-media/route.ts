import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `blog/${fileName}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    const imageUrl = `https://dw1utqy4bbv8r.cloudfront.net/blog/${fileName}`;
    // const imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/blog/${fileName}`

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
