"use client";

import React, { useState, useEffect } from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input, Modal, Upload, Spin, Checkbox } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  uploadFilesToFirebase,
  uploadSingleFileToFirebase,
} from "@/lib/utils/upload-media";
import { addProperty, editProperty } from "@/actions/properties";
import { toast } from "sonner";
import { Icons } from "@/components/globals/icons";
import { surroundingFeatures } from "@/constants";
import {
  Plus,
  Upload as UploadIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MAX_OTHER_PHOTOS = 29;
const INITIAL_PHOTO_DISPLAY = 8;

export default function Media({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [coverPhotoLoading, setCoverPhotoLoading] = useState(false);
  const [otherPhotosLoading, setOtherPhotosLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const { id }: any = useParams();
  const router = useRouter();

  useEffect(() => {
    if (isEdit && id) {
      setCoverPhoto(finalValues.media.coverPhotos?.[0] || null);
      setImageUrls(finalValues.media.images?.slice(0, MAX_OTHER_PHOTOS) || []);
    } else if (finalValues.media) {
      setCoverPhoto(finalValues.media.coverPhotos?.[0] || null);
      setImageUrls(finalValues.media.images?.slice(0, MAX_OTHER_PHOTOS) || []);
    }
  }, [isEdit, id, finalValues]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const newImagesURLs = await uploadFilesToFirebase(uploadedFiles);
      const allImageUrls = [...new Set([...imageUrls, ...newImagesURLs])].slice(
        0,
        MAX_OTHER_PHOTOS
      );

      const savedValues = {
        ...finalValues.basicInfo,
        ...values,
        images: allImageUrls,
        coverPhotos: coverPhoto ? [coverPhoto] : [],
        surroundingFeatures: values.surroundingFeatures || [],
        videoLink: values.videoLink || "",
      };

      let res = null;
      if (isEdit) {
        res = await editProperty(id, savedValues);
      } else {
        res = await addProperty(savedValues);
      }
      if (res.error) throw new Error(res.error);

      toast.success(
        isEdit ? "Edit saved successfully" : "Property added successfully"
      );
      router.push(`/agent/properties`);
    } catch (error: any) {
      toast.error("Failed to create property");
      console.error(error.message);
    } finally {
      setLoading(false);
      setHasUnsavedChanges(false);
    }
  };

  const handleCancel = () => setPreviewVisible(false);
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

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCoverPhotoRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    setCoverPhoto(null);
    setFinalValues({
      ...finalValues,
      media: {
        ...finalValues.media,
        coverPhotos: [],
      },
    });
    setHasUnsavedChanges(true);
  };

  const handleOtherPhotoRemove = (event: React.MouseEvent, image: string) => {
    event.preventDefault();
    setImageUrls((prev) => prev.filter((img) => img !== image));
    setUploadedFiles((prev) => prev.filter((file) => file.name !== image));
    setHasUnsavedChanges(true);
  };

  const handleCoverPhotoUpload = async (file: File) => {
    try {
      setCoverPhotoLoading(true);
      const url = await uploadSingleFileToFirebase(file);

      setImageUrls((prevUrls) => prevUrls.filter((img) => img !== url));

      setCoverPhoto(url);
      setFinalValues({
        ...finalValues,
        media: {
          ...finalValues.media,
          coverPhotos: [url],
        },
      });
      setHasUnsavedChanges(true);
    } catch (error) {
      toast.error("Failed to upload cover photo");
    } finally {
      setCoverPhotoLoading(false);
    }
  };

  const handleOtherPhotoUpload = async (file: File) => {
    try {
      if (imageUrls.length >= MAX_OTHER_PHOTOS) {
        toast.info(`Maximum ${MAX_OTHER_PHOTOS} other photos allowed`);
        return;
      }
      setOtherPhotosLoading(true);
      const url = await uploadSingleFileToFirebase(file);
      if (!imageUrls.includes(url) && coverPhoto !== url) {
        setImageUrls((prev) => [...prev, url].slice(0, MAX_OTHER_PHOTOS));
        setUploadedFiles((prev) => [...prev, file].slice(0, MAX_OTHER_PHOTOS));
        setHasUnsavedChanges(true);
      } else if (coverPhoto === url) {
        toast.info("This image is already set as the cover photo");
      } else {
        toast.info("This image has already been uploaded");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setOtherPhotosLoading(false);
    }
  };

  const renderImagePreview = (
    image: string,
    index: number,
    isCoverPhoto: boolean = false
  ) => (
    <div
      key={index}
      className="relative w-32 h-32 mb-4 border border-gray-300 rounded-lg overflow-hidden"
    >
      <Image
        src={image}
        alt={isCoverPhoto ? "Cover Photo" : `Property Photo ${index + 1}`}
        layout="fill"
        objectFit="cover"
      />
      <button
        onClick={(event) =>
          isCoverPhoto
            ? handleCoverPhotoRemove(event)
            : handleOtherPhotoRemove(event, image)
        }
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <Icons.trash className="w-4 h-4" />
      </button>
      {isCoverPhoto && (
        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
          Cover Photo
        </div>
      )}
    </div>
  );

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        surroundingFeatures: finalValues.surroundingFeatures,
        videoLink: finalValues.videoLink,
        ...finalValues,
      }}
    >
      <h2 className="text-lg font-medium my-4 text-blue-600">
        Property Photos
      </h2>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium mb-2">Cover Photo</h3>
        <div className="flex items-center gap-4">
          {coverPhoto && renderImagePreview(coverPhoto, -1, true)}
          <Upload
            listType="picture-card"
            maxCount={1}
            onPreview={handlePreview}
            beforeUpload={(file) => {
              handleCoverPhotoUpload(file);
              return false;
            }}
            className="w-32 h-32"
          >
            {coverPhotoLoading ? (
              <Spin />
            ) : (
              <div className="flex items-center flex-col">
                {coverPhoto ? (
                  <UploadIcon className="w-5 h-5 mb-1" />
                ) : (
                  <Plus className="w-5 h-5 mb-1" />
                )}
                <div>{coverPhoto ? "Change" : "Add"} Cover Photo</div>
              </div>
            )}
          </Upload>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium mb-2">
          Other Photos (Max {MAX_OTHER_PHOTOS})
        </h3>
        <div
          className={`flex flex-wrap gap-4 overflow-y-auto ${
            showAllPhotos ? "max-h-[600px]" : "max-h-[300px]"
          }`}
        >
          {imageUrls.map((image, index) => renderImagePreview(image, index))}
          {imageUrls.length < MAX_OTHER_PHOTOS && (
            <Upload
              listType="picture-card"
              multiple
              onPreview={handlePreview}
              beforeUpload={(file) => {
                handleOtherPhotoUpload(file);
                return false;
              }}
              className="w-32 h-32"
            >
              {otherPhotosLoading ? (
                <Spin />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus className="w-5 h-5 mb-1" />
                  <div>Add Photos</div>
                </div>
              )}
            </Upload>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {imageUrls.length} / {MAX_OTHER_PHOTOS} photos uploaded
        </p>
        {imageUrls.length > INITIAL_PHOTO_DISPLAY && (
          <Button
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="mt-4"
            icon={
              showAllPhotos ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            }
          >
            {showAllPhotos ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Surrounding Features/Amenities (Within 2KM Radius)
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="surroundingFeatures"
          label=""
          rules={[
            {
              required: true,
              message: "Surrounding Features are required",
            },
          ]}
          className="flex w-full items-center justify-start col-span-full gap-5"
        >
          <Checkbox.Group
            options={surroundingFeatures}
            className="w-full gap-5"
          />
        </Form.Item>
      </section>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Property Video Link (Optional)
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="videoLink"
          label=""
          className="col-span-1"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL",
            },
          ]}
        >
          <Input
            placeholder="Video Link (optional)"
            type="url"
            className="border border-gray-300 rounded-md"
          />
        </Form.Item>
      </section>

      <section className="border-b border-neutral-200 w-full my-8"></section>

      <div className="flex items-center justify-end gap-5">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-3 text-center rounded-md flex items-center justify-center"
        >
          Back
        </Button>
        <button
          type="submit"
          className={`inline-block cursor-pointer items-center rounded-md ${
            hasUnsavedChanges ? "bg-blue-500" : "bg-blue-300"
          } hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white`}
        >
          {loading ? (
            <>
              {!isEdit ? (
                <div className="flex items-center">
                  <Icons.spinner className="size-4 animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Icons.spinner className="size-4 animate-spin mr-2" />
                  Submitting...
                </div>
              )}
            </>
          ) : (
            <>
              {isEdit
                ? hasUnsavedChanges
                  ? "Save Changes"
                  : "Save Edited Property"
                : "Save Property"}
            </>
          )}
        </button>
      </div>
    </Form>
  );
}
