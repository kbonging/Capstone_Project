import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가

export default function MyCancelList() {
  const [activeTab, setActiveTab] = useState("cancel"); // cancel | count
  const navigate = useNavigate(); // ✅ 훅 사용

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 탭 영역 */}
      <div className="flex text-sm">
        <button
          onClick={() => setActiveTab("cancel")}
          className={`px-4 py-2 font-medium ${
            activeTab === "cancel"
              ? "text-black border-b-2 border-sky-500"
              : "text-gray-400"
          }`}
        >
          취소내역
        </button>
        <button
          onClick={() => setActiveTab("count")}
          className={`px-4 py-2 font-medium ${
            activeTab === "count"
              ? "text-black border-b-2 border-sky-500"
              : "text-gray-400"
          }`}
        >
          취소 횟수 내역
        </button>

        {/* 우측 버튼 */}
        <div className="ml-auto">
          <button
            onClick={() => navigate("/cancel/request")} // ✅ 페이지 이동
            className="bg-sky-500 text-white text-sm px-4 py-2 rounded hover:bg-sky-600"
          >
            체험단 취소하기
          </button>
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="py-16 text-center text-gray-700">
        {activeTab === "cancel" ? (
          <p>취소 내역이 없습니다.</p>
        ) : (
          <p>취소 횟수 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
