import { uploadToS3 } from "@/lib/utils/s3-operations";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "guides";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate a unique key for the file
    const timestamp = Date.now();
    const fileName = file.name.replace(/\s+/g, "-").toLowerCase();
    const key = `${folder}/${timestamp}-${fileName}`;

    // Upload to S3
    const result = await uploadToS3(file, key);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.data.fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
