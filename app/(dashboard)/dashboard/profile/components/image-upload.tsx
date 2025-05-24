"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Camera, Loader2, Upload, X } from "lucide-react";
import AvatarEditor from "react-avatar-editor";
import { updateProfilePhoto, removeUserImage } from "../use-actions";
import { useGlobalSession } from "@/providers/session-provider";

export default function ImageUpload({
  profileImage,
  userId,
}: {
  profileImage?: string | null;
  userId: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { updateSession, refreshSession } = useGlobalSession();
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDialogOpen(true);
    }
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    if (!editorRef.current || !image) {
      toast.error("No image selected");
      return;
    }

    setIsUploading(true);

    try {
      const canvas = editorRef.current.getImageScaledToCanvas();

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create image blob"));
            }
          },
          "image/jpeg",
          0.95
        );
      });

      // Create a File from the blob
      const croppedFile = new File(
        [blob],
        `profile-${userId}-${Date.now()}.jpg`,
        {
          type: "image/jpeg",
          lastModified: Date.now(),
        }
      );

      // Create form data for S3 upload
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("userId", userId);
      formData.append("type", "profile");

      console.log("Uploading to S3...");

      // Upload to S3
      const response = await fetch("/api/upload/s3", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Upload failed with response:", responseText);

        let errorMessage = "Failed to upload image";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          if (responseText.includes("<!DOCTYPE")) {
            errorMessage = `Server error (${response.status}). Please try again.`;
          } else {
            errorMessage = responseText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const uploadResult = await response.json();

      if (!uploadResult.url) {
        throw new Error("No URL returned from upload");
      }

      console.log("Upload successful, URL:", uploadResult.url);

      // Update profile photo in database using server action
      const result = await updateProfilePhoto(userId, uploadResult.url);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile photo");
      }

      // Update global session
      await updateSession({
        image: uploadResult.url,
      });

      // Force refresh session from server
      await refreshSession();

      toast.success("Profile photo updated successfully");
      setIsDialogOpen(false);

      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setImage(null);
      setScale(1.2);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!profileImage) {
      toast.error("No image to remove");
      return;
    }

    setIsRemoving(true);

    try {
      console.log("Removing profile image...");

      // Use server action to remove image from S3 and database
      await removeUserImage(userId, "profile");

      // Update global session
      await updateSession({
        image: null,
      });

      // Force refresh session from server
      await refreshSession();

      toast.success("Profile photo removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(
        `Failed to remove image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    // Only allow closing if we're not uploading
    if (!isUploading) {
      setIsDialogOpen(open);
      if (!open) {
        // Clean up when dialog closes
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setImage(null);
        setScale(1.2);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading || isRemoving}
      />

      <Card className="shadow-none">
        <CardContent className="p-4 flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted">
            {profileImage ? (
              <Image
                src={`${profileImage}?t=${Date.now()}`}
                alt="Profile"
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              disabled={isUploading || isRemoving}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            {profileImage && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isRemoving || isUploading}
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Upload a profile photo. Max file size: 5MB
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Image</DialogTitle>
            <DialogDescription>
              Adjust the image to fit the frame. Drag to reposition and use the
              slider to zoom.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            {previewUrl && (
              <AvatarEditor
                ref={editorRef}
                image={previewUrl}
                width={250}
                height={250}
                border={50}
                borderRadius={125}
                color={[0, 0, 0, 0.6]}
                scale={scale}
                rotate={0}
              />
            )}

            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Zoom</span>
                <span className="text-sm">{Math.round(scale * 100)}%</span>
              </div>
              <Slider
                defaultValue={[1.2]}
                min={1}
                max={3}
                step={0.1}
                value={[scale]}
                onValueChange={handleScaleChange}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
