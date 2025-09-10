import React, { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import ProgressBar from "./ProgressBar";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";


import { createCampaign, getCampaignDetail, updateCampaign } from "../../api/campaigns/api";

export default function CampaignForm({ mode = "create", campaignIdx }) {
  const [step, setStep] = useState(1);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shopName: "",
    title: "",
    thumbnailUrl: "",
    contactPhone: "",
    campaignType: "",
    categoryCode: "",
    channelCode: "",
    address: "",
    addressDetail: "",
    purchaseUrl: "",
    expDay: "",
    startTime: "",
    endTime: "",
    reservationNotice: "",
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

    // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (mode === "edit" && campaignIdx) {
      (async () => {
        try {
          const campaign = await getCampaignDetail(campaignIdx);
          setFormData(campaign);
          console.log(campaign);
        } catch (error) {
          console.error("캠페인 데이터 불러오기 실패", error);
          alert("캠페인 데이터를 불러오는데 실패했습니다.");
        }
      })();
    }
  }, [mode, campaignIdx, token]);

  const baseSteps = ["기본설정", "홍보 유형 및 채널과 카테고리", "체험 가능 요일 및 시간", "체험단 설정"];

  const stepsForType = useMemo(() => {
    const t = formData.campaignType;
    if (t === "CAMP003" || t === "CAMP004") {
      return ["기본설정", "홍보 유형 및 채널과 카테고리", "체험단 설정"];
    }
    return baseSteps;
  }, [formData.campaignType]);

  // Step1 유효성 체크
  const isStep1Valid = useMemo(() => {
    const hasPhone = /^010-\d{3,4}-\d{4}$/.test(formData.contactPhone);
    return Boolean(formData.shopName && formData.title && formData.thumbnailUrl && hasPhone);
  }, [formData]);

  // Step2 유효성 체크
  const isStep2Valid = useMemo(() => {
    if (!formData.campaignType || !formData.categoryCode || !formData.channelCode) return false;

    if (formData.campaignType === "CAMP001" || formData.campaignType === "CAMP002") {
      if (!formData.address || !formData.addressDetail) return false;
    }

    if (formData.campaignType === "CAMP003" || formData.campaignType === "CAMP004") {
      if (!formData.purchaseUrl) return false;
    }

    return true;
  }, [formData]);

  // Step3 유효성 체크
  const isStep3Valid = useMemo(() => {
    if (!formData.expDay || formData.expDay.length === 0) return false; 
    if (!formData.startTime || !formData.endTime) return false;
    if (formData.startTime >= formData.endTime) return false;
    return true;
  }, [formData.expDay, formData.startTime, formData.endTime]);

  // Step4 유효성 체크
  const isStep4Valid = useMemo(() => {
    return (
      formData.mission &&
      formData.keyword1 &&
      formData.benefitDetail &&
      formData.recruitCount > 0 &&
      formData.recruitCount <= 50 &&
      formData.applyStartDate &&
      formData.applyEndDate &&
      formData.expStartDate &&
      formData.expEndDate &&
      formData.announceDate &&
      formData.deadlineDate
    );
  }, [formData]);


  const [maxStep, setMaxStep] = useState(1);

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    if (step === 3 && stepsForType.length === 4 && !isStep3Valid) return;

    const last = stepsForType.length;
    const next = Math.min(step + 1, last);

    setStep(next);
    setMaxStep((prev) => Math.min(Math.max(prev, next), last));
  };


  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  React.useEffect(() => {
    // Step1이 유효하지 않으면 강제로 Step1로
    if (!isStep1Valid && step > 1) {
      setStep(1);
      setMaxStep(1);
    }
    // Step2가 유효하지 않으면 Step2까지만 허용
    else if (step >= 2 && !isStep2Valid && maxStep > 2) {
      setStep(2);
      setMaxStep(2);
    }
    // Step3가 유효하지 않으면 Step3까지만 허용
    else if (stepsForType.length === 4 && step >= 3 && !isStep3Valid && maxStep > 3) {
      setStep(3);
      setMaxStep(3);
    }
  }, [isStep1Valid, isStep2Valid, isStep3Valid, step, stepsForType.length]);


  return (
    <div className="space-y-6">
      <ProgressBar
        steps={stepsForType}
        currentStep={step}
        maxStep={maxStep}
        onStepClick={(idx) => {
          const target = idx + 1;
          if (target <= maxStep) setStep(target);
        }}
      />

      {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
      {step === 3 && stepsForType.length === 4 && <Step3 formData={formData} setFormData={setFormData} />}
      {step === stepsForType.length && <Step4 formData={formData} setFormData={setFormData} />}

      {/* 버튼 */}
      <div className="flex justify-end mt-4 space-x-2">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            이전
          </button>
        )}
        {step < stepsForType.length && (
          <button
            onClick={nextStep}
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && stepsForType.length === 4 && !isStep3Valid)}
            className={`px-4 py-2 rounded ${
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid) ||
              (step === 3 && stepsForType.length === 4 && !isStep3Valid)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            다음
          </button>
        )}

        {step === stepsForType.length && (
          <button
            onClick={async () => {
              if (!isStep4Valid) {
                alert("필수 항목을 모두 입력해주세요.");
                return;
              }

              console.log("✅ 최종 제출 데이터:", formData);

              try {
                if (mode === "edit") {
                  // 수정 API 호출
                  const response = await updateCampaign(campaignIdx, formData, token);
                  console.log("캠페인 수정 성공", response.data);
                  alert("캠페인이 성공적으로 수정되었습니다.");
                } else {
                  // 등록 API 호출
                  const response = await createCampaign(formData, token);
                  console.log("캠페인 등록 성공", response.data);
                  alert("캠페인이 성공적으로 등록되었습니다.");
                }

                navigate("/campaign/manage");
              } catch (error) {
                console.error(
                  "캠페인 저장 실패",
                  error.response?.data || error.message
                );
                alert(
                  error.response?.data ||
                    "캠페인 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                );
              }
            }}
            disabled={!isStep4Valid}
            className={`px-4 py-2 rounded ${
              !isStep4Valid
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {mode === "edit" ? "체험단 수정" : "체험단 등록"}
          </button>
        )}
      </div>

    </div>
  );
}
