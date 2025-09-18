// src/components/campaign/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ steps, currentStep, maxStep, onStepClick }) {
  return (
    <div className="flex justify-between mb-16">
      {steps.slice(0, maxStep).map((label, index) => {
        const stepNumber = index + 1;
        const active = currentStep === stepNumber;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onStepClick(index)}
            className="flex-1 text-center focus:outline-none"
          >
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1 transition
                ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {stepNumber}
            </div>
            <div className={`text-xs ${active ? "font-semibold" : ""}`}>{label}</div>
          </button>
        );
      })}
    </div>
  );
}
