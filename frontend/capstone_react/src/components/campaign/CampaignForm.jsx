// src/components/campaign/CampaignForm.jsx
import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export default function CampaignForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step1
    title: "",
    thumbnailUrl: "",
    contactPhone: "",
    // Step2
    campaignType: "",
    campaignCategory: "",
    channelCode: "",
    address: "",
    addressDetail: "",
    purchaseUrl: "",
    // Step3
    day: "",
    startTime: "",
    endTime: "",
    reservationNotice: "",
    // Step4
    mission: "",
    keyword1: "",
    keyword2: "",
    keyword3: "",
    benefitDetail: "",
    recruitCount: 0,
    applyStartDate: "",
    applyEndDate: "",
    announceDate: "",
    expStartDate: "",
    expEndDate: "",
    deadlineDate: "",
  });

  const [stepsForType, setStepsForType] = useState([
    "기본정보",
    "홍보/채널/카테고리",
    "step3",
    "체험단 설정",
  ]);

  // 캠페인 유형에 따라 스텝 구성 동적 변경
  useEffect(() => {
    const type = formData.campaignType;
    if (type === "delivery" || type === "purchase") {
      setStepsForType(["기본정보", "홍보/채널/카테고리", "체험단 설정"]);
      if (step > 2) setStep(3); // Step3 건너뛰고 Step4로 이동
    } else if (type === "visit" || type === "takeout") {
      setStepsForType(["기본정보", "홍보/채널/카테고리", "방문형/배송형 입력", "체험단 설정"]);
    }
  }, [formData.campaignType]);

  const nextStep = () => {
    if (formData.campaignType === "delivery" || formData.campaignType === "purchase") {
      setStep((prev) => Math.min(prev + 1, 3)); // Step3 건너뛰기
    } else {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <ProgressBar steps={stepsForType} currentStep={step} setStep={setStep} />

      {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
      {step === 3 && (formData.campaignType === "visit" || formData.campaignType === "takeout") && (
        <Step3 formData={formData} setFormData={setFormData} />
      )}
      {step === (formData.campaignType === "delivery" || formData.campaignType === "purchase" ? 3 : 4) && (
        <Step4 formData={formData} setFormData={setFormData} />
      )}

      <div className="flex justify-end mt-4 space-x-2">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            이전
          </button>
        )}
        {step < stepsForType.length && (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            다음
          </button>
        )}
        {step === stepsForType.length && (
          <button
            onClick={() => console.log(formData)}
            className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            제출
          </button>
        )}
      </div>
    </div>
  );
}
