"use client";

import React, { useState, useEffect } from "react";
import { PropertiesFormStepProps } from "./index";
import { Form, Input, Modal, Upload, Spin, Checkbox } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  uploadToS3,
  deleteFromS3,
  getSignedDownloadUrl,
} from "@/lib/utils/s3-operations";
import { addProperty, editProperty } from "@/actions/properties";
import { toast } from "sonner";
import { surroundingFeatures } from "@/constants";
import { TrashIcon } from "lucide-react";
import heic2any from "heic2any";
import { Button } from "@/components/ui/button";

interface ImageFile {
  file: File | string;
  preview: string;
}

export default function Media({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const [tempFiles, setTempFiles] = useState<ImageFile[]>([]);
  const [coverPhotos, setCoverPhotos] = useState<ImageFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [coverPhotoLoading, setCoverPhotoLoading] = useState(false);
  const [otherPhotosLoading, setOtherPhotosLoading] = useState(false);
  const [previewsLoaded, setPreviewsLoaded] = useState(false);

  const { id }: { id?: string } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      const isCloning = !id;
      const initialCoverPhotos = (finalValues.media?.coverPhotos || []).map(
        (url: string) => ({
          file: url,
          preview: isCloning ? "" : url,
        })
      );
      const initialTempFiles = (finalValues.media?.images || []).map(
        (url: string) => ({
          file: url,
          preview: isCloning ? "" : url,
        })
      );

      setCoverPhotos(initialCoverPhotos);
      setTempFiles(initialTempFiles);

      if (isCloning) {
        loadImagePreviews(initialCoverPhotos, initialTempFiles);
      } else {
        setPreviewsLoaded(true);
      }
    } else {
      setPreviewsLoaded(true);
    }
  }, [isEdit, id, finalValues]);

  const loadImagePreviews = async (
    initialCoverPhotos: ImageFile[],
    initialTempFiles: ImageFile[]
  ) => {
    const loadPreview = async (url: string) => {
      try {
        const signedUrl = await getSignedDownloadUrl(url);
        return signedUrl.success ? signedUrl.data.url : "";
      } catch (error) {
        console.error("Failed to load image preview:", error);
        return "";
      }
    };

    const updatedCoverPhotos = await Promise.all(
      initialCoverPhotos.map(async (photo) => ({
        ...photo,
        preview: photo.preview || (await loadPreview(photo.file as string)),
      }))
    );
    setCoverPhotos(updatedCoverPhotos);

    const updatedTempFiles = await Promise.all(
      initialTempFiles.map(async (file) => ({
        ...file,
        preview: file.preview || (await loadPreview(file.file as string)),
      }))
    );
    setTempFiles(updatedTempFiles);
    setPreviewsLoaded(true);
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      try {
        const jpegBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        return new File(
          [jpegBlob as Blob],
          file.name.replace(/\.heic$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      } catch (error) {
        console.error("Error converting HEIC to JPEG:", error);
        throw new Error("Failed to convert HEIC image");
      }
    }
    return file;
  };

  const handleFileUpload = async (file: File, isCoverPhoto: boolean) => {
    try {
      const convertedFile = await convertHeicToJpeg(file);
      const key = `${
        isCoverPhoto ? "cover-photos" : "property-photos"
      }/${Date.now()}-${convertedFile.name}`;
      const uploadResult = await uploadToS3(convertedFile, key);

      if (uploadResult.success) {
        const signedUrlResult = await getSignedDownloadUrl(key);
        const preview = signedUrlResult.success ? signedUrlResult.data.url : "";
        const newImageFile: ImageFile = {
          file: uploadResult.data.fileUrl,
          preview,
        };

        if (isCoverPhoto) {
          setCoverPhotos((prev) => [...prev, newImageFile]);
        } else {
          setTempFiles((prev) => [...prev, newImageFile]);
        }
      } else {
        throw new Error(uploadResult.message);
      }
    } catch (error) {
      console.error("Failed to process the image:", error);
      toast.error(`Failed to process the image: ${(error as Error).message}`);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const uploadedCoverPhotos = coverPhotos.map((photo) => photo.file);
      const uploadedImages = tempFiles.map((imageFile) => imageFile.file);

      const savedValues = {
        ...finalValues.basicInfo,
        ...values,
        coverPhotos: uploadedCoverPhotos,
        images: uploadedImages,
      };

      const res = isEdit
        ? await editProperty(id!, savedValues)
        : await addProperty(savedValues);

      if (res.error) throw new Error(res.error);

      toast.success(
        isEdit ? "Property updated successfully" : "Property added successfully"
      );
      router.push("/agent/properties");
    } catch (error: any) {
      toast.error(
        isEdit ? "Failed to update property" : "Failed to create property"
      );
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCoverPhotoRemove = async (index: number) => {
    const photo = coverPhotos[index];
    if (typeof photo.file === "string") {
      try {
        const deleteResult = await deleteFromS3(photo.file);
        if (!deleteResult.success) {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        console.error("Failed to delete photo from S3:", error);
        toast.error("Failed to delete photo. Please try again.");
        return;
      }
    }
    setCoverPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOtherPhotoRemove = async (index: number) => {
    const photo = tempFiles[index];
    if (typeof photo.file === "string") {
      try {
        const deleteResult = await deleteFromS3(photo.file);
        if (!deleteResult.success) {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        console.error("Failed to delete photo from S3:", error);
        toast.error("Failed to delete photo. Please try again.");
        return;
      }
    }
    setTempFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        surroundingFeatures: finalValues.surroundingFeatures,
        videoLink: finalValues.videoLink,
      }}
    >
      {previewsLoaded && (
        <>
          <h2 className="text-lg font-medium my-4 text-blue-600">
            Cover Photo (max 1)
          </h2>
          <div className="mb-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {coverPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <Image
                    src={photo.preview}
                    alt={`Cover photo ${index + 1}`}
                    width={200}
                    height={150}
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCoverPhotoRemove(index);
                    }}
                    className="absolute top-2 left-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label={`Remove cover photo ${index + 1}`}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            <Upload
              listType="picture-card"
              fileList={[]}
              maxCount={1 - coverPhotos.length}
              onPreview={handlePreview}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
              }}
              beforeUpload={(file) => {
                setCoverPhotoLoading(true);
                handleFileUpload(file, true).finally(() =>
                  setCoverPhotoLoading(false)
                );
                return false;
              }}
            >
              {coverPhotoLoading ? (
                <Spin />
              ) : (
                coverPhotos.length < 1 && <div>Upload Cover Photo</div>
              )}
            </Upload>
          </div>

          <h2 className="text-lg font-medium my-4 text-blue-600">
            Other Photos (max. 29 photos)
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {tempFiles.map((imageFile, index) => (
              <div key={index} className="relative">
                <Image
                  src={imageFile.preview}
                  alt={`Property photo ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOtherPhotoRemove(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <TrashIcon className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <Upload
            listType="picture-card"
            fileList={[]}
            multiple
            maxCount={29 - tempFiles.length}
            onPreview={handlePreview}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
              }
            }}
            beforeUpload={(file) => {
              setOtherPhotosLoading(true);
              handleFileUpload(file, false).finally(() =>
                setOtherPhotosLoading(false)
              );
              return false;
            }}
          >
            {otherPhotosLoading ? <Spin /> : <div>Upload Property Photos</div>}
          </Upload>
        </>
      )}

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Surrounding Features/Amenities (Within 2KM Radius)
      </h2>
      <Form.Item
        name="surroundingFeatures"
        rules={[
          { required: true, message: "Please select surrounding features" },
        ]}
      >
        <Checkbox.Group
          options={surroundingFeatures}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        />
      </Form.Item>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Property Video Link (Optional)
      </h2>
      <Form.Item
        name="videoLink"
        rules={[{ type: "url", message: "Please enter a valid URL" }]}
      >
        <Input placeholder="Video Link (optional)" type="url" />
      </Form.Item>

      <div className="flex items-center justify-end gap-5 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep(currentStep - 1);
          }}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isEdit ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </Form>
  );
}
