"use client";
import React, { useState } from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Upload } from "antd";
import Image from "next/image";

export default function Media({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
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
        >
          Back
        </Button>
        <Button type="primary" onClick={() => onSubmit()}>
          Next
        </Button>
      </div>
    </div>
  );
}
