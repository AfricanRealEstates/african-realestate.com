"use client";
import React, { useState } from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Upload } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { uploadFilesToFirebase } from "@/lib/utils/upload-media";
import { addProperty, editProperty } from "@/actions/properties";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Icons } from "@/components/globals/icons";

export default function Media({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const [tempFiles, setTempFiles] = useState<any[]>([]);
  // const onSubmit = () => {
  //   setFinalValues({
  //     ...finalValues,
  //     media: { newlyUploadFiles: tempFiles, images: finalValues.media.images },
  //   });
  //   setCurrentStep(currentStep + 1);
  // };

  const { id }: any = useParams();
  const router = useRouter();

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const tempFinalValues = {
        ...finalValues,
        amenities: values,
        media: {
          newlyUploadFiles: tempFiles,
          images: finalValues.media.images,
        },
      };

      // Handle images upload
      const tempMedia = tempFinalValues.media;
      const newImagesURLs = await uploadFilesToFirebase(
        tempMedia.newlyUploadFiles
      );

      tempMedia.images = [...tempMedia.images, ...newImagesURLs];

      tempFinalValues.media = tempMedia;
      // ...tempFinalValues.agentInfo,
      // ...tempFinalValues.locationInfo,
      // ...tempFinalValues.amenities,
      const savedValues = {
        ...tempFinalValues.basicInfo,
        images: tempFinalValues.media.images,
      };
      let res = null;
      if (isEdit) {
        res = await editProperty(id, savedValues);
      } else {
        res = await addProperty(savedValues);
      }
      if (res.error) throw new Error(res.error);
      // Toast messages
      if (isEdit) {
        toast.success("Edit saved successfully");
      } else {
        toast.success("Property added successfully");
      }
      router.push(`/agent/properties`);
    } catch (error: any) {
      toast.error("Failed to create property");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={finalValues.amenities}
    >
      <section className="flex flex-wrap gap-5 mb-5">
        {finalValues.media.images.map((image: string) => {
          return (
            <div
              key={image}
              className="flex flex-col gap-1 border border-dashed border-gray-400 p-2 rounded justify-center items-center"
            >
              <Image
                height={70}
                width={70}
                src={image}
                alt=""
                className="object-cover"
              />
              <span
                className="text-red-500 underline text-sm cursor-pointer"
                onClick={() => {
                  let tempMedia = finalValues.media;
                  tempMedia.images = tempMedia.images.filter(
                    (img: string) => img !== image
                  );
                  setFinalValues({
                    ...finalValues,
                    media: {
                      newlyUploadedFiles: tempFiles,
                      images: tempMedia.images,
                    },
                  });
                }}
              >
                Delete
              </span>
            </div>
          );
        })}
      </section>
      <Upload
        listType="picture-card"
        multiple
        beforeUpload={(file: any) => {
          setTempFiles((prev) => [...prev, file]);
          return false;
        }}
      >
        Upload Property Photos
      </Upload>

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
          className="inline-block  cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
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
            <>{isEdit ? "Save Edited Property" : "Save Property"}</>
          )}
        </button>
      </div>
    </Form>
  );
}
