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
  const onSubmit = () => {
    setFinalValues({
      ...finalValues,
      media: { newlyUploadFiles: tempFiles, images: finalValues.media.images },
    });
    setCurrentStep(currentStep + 1);
  };

  return (
    <div>
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

      <div className="flex justify-end gap-5">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-3 text-center rounded-md flex items-center justify-center"
        >
          Back
        </Button>

        <Button
          type="primary"
          onClick={() => onSubmit()}
          className="flex items-center justify-center  cursor-pointer rounded-md bg-blue-300 hover:!bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
