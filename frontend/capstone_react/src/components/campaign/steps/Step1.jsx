// src/components/campaign/steps/Step1.jsx
import React, { useState, useRef, useEffect } from "react";

export default function Step1({ formData, setFormData }) {
  const [thumbnailPreview, setThumbnailPreview] = useState(formData.thumbnailUrl || null);
  const phone3Ref = useRef(null);

  // 상호명
  const handleShopName = (e) => setFormData((p) => ({ ...p, shopName: e.target.value }));

  // 제목
  const handleTitle = (e) => setFormData((p) => ({ ...p, title: e.target.value }));

  // 썸네일
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
    setFormData((p) => ({ ...p, thumbnailUrl: url, thumbnailFile: file }));
  };
  const handleRemoveImage = () => {
    setThumbnailPreview(null);
    setFormData((p) => ({ ...p, thumbnailUrl: "", thumbnailFile: null }));
  };

  // 연락처(010 고정)
  const phone2 = formData.contactPhone.split("-")[1] || "";
  const phone3 = formData.contactPhone.split("-")[2] || "";
  const updatePhone = (part, val) => {
    const v = val.replace(/\D/g, "");
    const p2 = part === "phone2" ? v : phone2;
    const p3 = part === "phone3" ? v : phone3;
    setFormData((p) => ({ ...p, contactPhone: `010-${p2}-${p3}` }));
    if (part === "phone2" && v.length === 4) phone3Ref.current?.focus();
  };

  // 초기값 보정(빈값이면 "010--" 대신 공백 유지)
  useEffect(() => {
    if (!formData.contactPhone) {
      setFormData((p) => ({ ...p, contactPhone: "010--" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* 상호명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">상호명 *</label>
        <input
          type="text"
          value={formData.shopName}
          onChange={handleShopName}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          placeholder="상호명을 입력하세요"
        />
      </div>

      {/* 캠페인 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">캠페인 제목 *</label>
        <input
          type="text"
          value={formData.title}
          onChange={handleTitle}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          placeholder="캠페인 제목을 입력하세요"
        />
      </div>

      {/* 썸네일 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 이미지 *</label>
        <label
          htmlFor="thumbnail"
          className="cursor-pointer block border-dashed border-2 border-gray-300 rounded p-6 text-center text-sm text-gray-500 hover:bg-gray-50 relative"
        >
          {thumbnailPreview ? (
            <>
              <img src={thumbnailPreview} alt="썸네일 미리보기" className="mx-auto h-40 object-contain" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </>
          ) : (
            <>
              이미지 업로드 영역 (JPG, PNG 최대 10MB) <br />
              <span className="text-blue-500 underline">클릭해서 파일 선택</span>
            </>
          )}
        </label>
        <p className="text-red-500 text-xs mt-1">※ 검수 불가 시 등록이 제한될 수 있습니다.</p>
        <input id="thumbnail" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* 담당자 연락처 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">담당자 연락처 *</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value="010"
            readOnly
            className="w-16 border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
          <input
            type="text"
            value={phone2}
            onChange={(e) => updatePhone("phone2", e.target.value)}
            maxLength={4}
            className="w-20 border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="1234"
            inputMode="numeric"
          />
          <input
            type="text"
            value={phone3}
            onChange={(e) => updatePhone("phone3", e.target.value)}
            maxLength={4}
            ref={phone3Ref}
            className="w-20 border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="5678"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}
