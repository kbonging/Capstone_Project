// src/components/campaign/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ steps, currentStep, setStep }) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex-1 text-center cursor-pointer">
          <div
            onClick={() => setStep(index + 1)}
            className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1 transition
              ${currentStep === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
            `}
          >
            {index + 1}
          </div>
          <div className="text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
}
