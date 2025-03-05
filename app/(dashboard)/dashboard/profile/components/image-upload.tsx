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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

  const router = useRouter();
  const { update } = useSession();
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }

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
    if (editorRef.current && image) {
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
        const croppedFile = new File([blob], image.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        // Create form data for the API request
        const formData = new FormData();
        formData.append("file", croppedFile);
        formData.append("type", "profile");

        // Upload the image
        const response = await fetch("/api/update-profile", {
          method: "POST",
          body: formData,
        });

        const responseText = await response.text();
        console.log("API Response text:", responseText);

        let result;
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.error("Error parsing response:", e);
          throw new Error("Invalid server response");
        }

        if (!response.ok) {
          throw new Error(result.error || "Server returned an error");
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to upload image");
        }

        // Update the NextAuth session with the new image URL
        await update({
          randomKey: Date.now().toString(), // Add a random key to force a refresh
        });

        // Only show success toast if we actually succeeded
        toast.success("Profile photo updated successfully");
        setIsDialogOpen(false);

        // Refresh the page to show the updated image
        router.refresh();
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(
          `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!profileImage) return;

    setIsRemoving(true);

    try {
      const response = await fetch(`/api/update-profile?type=profile`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      console.log("API Response text for delete:", responseText);

      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Error parsing delete response:", e);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(result.error || "Server returned an error");
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to remove image");
      }

      // Update the NextAuth session to remove the image
      await update({
        randomKey: Date.now().toString(), // Add a random key to force a refresh
      });

      toast.success("Profile photo removed successfully");

      // Refresh the page to show the updated image
      router.refresh();
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(
        `Failed to remove image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRemoving(false);
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
      />

      <Card className="shadow-none">
        <CardContent className="p-4 flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted">
            {profileImage ? (
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={triggerFileInput}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            {profileImage && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Remove
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if we're not uploading
          if (!isUploading) setIsDialogOpen(open);
        }}
      >
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
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
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
