"use client";
import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import BasicInfo from "./basic-info";
import LocationInfo from "./location-info";
import Media from "./media";
import Amenities from "./amenities";
import AgentInfo from "./agent-info";
import { useRouter } from "next/navigation";

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
      newlyUploadedFiles: [],
      images: initialValues.images || [],
    },
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
      title: "Basic Info",
      content: <BasicInfo {...commonSteps} />,
    },
    {
      title: "Location Info",
      content: <LocationInfo {...commonSteps} />,
    },
    {
      title: "Amenities",
      content: <Amenities {...commonSteps} />,
    },
    {
      title: "Media",
      content: <Media {...commonSteps} />,
    },

    {
      title: "Agent Info",
      content: <AgentInfo {...commonSteps} />,
    },
  ];

  useEffect(() => {
    console.log(finalValues);
  }, [finalValues]);

  return (
    <section className=" mb-9">
      <Steps items={steps} current={currentStep} />
      <div className="mt-8">{steps[currentStep].content}</div>
    </section>
  );
}
