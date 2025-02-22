"use client";
import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import BasicInfo from "./basic-info";
import Media from "./media";

export interface PropertiesFormStepProps {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  finalValues: any;
  setFinalValues: (finalValues: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isEdit?: boolean;
}
export default function PropertiesForm({
  initialValues = {},
  isEdit = false,
}: {
  initialValues?: any;
  isEdit?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const [currentStep = 0, setCurrentStep] = useState(0);
  const [finalValues, setFinalValues] = useState({
    basicInfo: initialValues,
    locationInfo: initialValues,
    media: {
      ...initialValues,
      newlyUploadedFiles: [],
      images: initialValues.images || [],
      coverPhotos: initialValues.coverPhotos || [],
    },
    surroundingFeatures: initialValues.surroundingFeatures || [],
    videoLink: initialValues.videoLink || "",
    amenities: initialValues,
    agentInfo: initialValues,
  });

  const commonSteps: any = {
    currentStep,
    setCurrentStep,
    finalValues,
    setFinalValues,
    loading,
    setLoading,
    isEdit,
  };

  const steps = [
    {
      title: "Property Information",
      content: <BasicInfo {...commonSteps} />,
    },
    {
      title: "Media",
      content: <Media {...commonSteps} />,
    },
  ];

  useEffect(() => {
    console.log(finalValues);
  }, [finalValues]);

  return (
    <section className="w-full lg:max-w-7xl mx-auto rounded border border-neutral-100 p-4 lg:p-8 mb-9">
      <Steps items={steps} current={currentStep} />
      <div className="mt-12">{steps[currentStep].content}</div>
    </section>
  );
}
