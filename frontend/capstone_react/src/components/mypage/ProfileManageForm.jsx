import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { FaBlogger, FaInstagram, FaYoutube, FaGlobe } from "react-icons/fa";

export default function ProfileManageForm({ user }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        blogUrl:
          user?.reviewerChannelList?.find((c) => c.infTypeCodeId === "INF001")
            ?.channelUrl || "",
        instaUrl:
          user?.reviewerChannelList?.find((c) => c.infTypeCodeId === "INF002")
            ?.channelUrl || "",
        youtubeUrl:
          user?.reviewerChannelList?.find((c) => c.infTypeCodeId === "INF003")
            ?.channelUrl || "",
        etcUrl:
          user?.reviewerChannelList?.find((c) => c.infTypeCodeId === "INF004")
            ?.channelUrl || "",
      });
    }
  }, [user]);

  // 1. 상태 정의
  const [agree, setAgree] = useState({
    commentNotificationAgree: false,
    pushNotificationAgree: false,
    marketingAgree: false,
  });

  // 2. 상태 변경 핸들러
  const handleAgreeChange = (e) => {
    const { name, checked } = e.target;
    setAgree((prev) => ({ ...prev, [name]: checked }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log("제출 데이터:", formData);
    // API 호출 예: axios.post("/api/members/update", formData)
  };

  // 3. Switch 컴포넌트
  const Switch = ({ name, checked, label }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleAgreeChange}  // <- 여기가 중요
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-1000 ease-in-out ${
            checked ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-1000 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );

  const role = user?.authDTOList?.[0]?.auth;

  return (
    <div className="max-w-2xl ml-6 text-base text-gray-600 font-medium font-['Noto_Sans_KR',sans-serif] space-y-10">
      {/* 이메일 */}
      <div className="mb-4">
        <label className="block mb-3">이메일</label>
        <input
          type="email"
          name="memberEmail"
          className="w-full border rounded px-4 py-2"
          value={formData.memberEmail || ""}
          disabled
        />
      </div>

      {/* 이름 - 공통 */}
      <div className="mb-4">
        <label className="block mb-3">이름</label>
        <input
          type="text"
          name="memberName"
          className="w-full border rounded px-4 py-2"
          value={formData.memberName || ""}
          onChange={handleChange}
          disabled
        />
      </div>

      {/* 닉네임 / 상호명 - 역할별 */}
      {role === "ROLE_USER" && (
        <div className="mb-4">
          <label className="block mb-3">닉네임</label>
          <input
            type="text"
            name="nickname"
            className="w-full border rounded px-4 py-2"
            value={formData.nickname || ""}
            onChange={handleChange}
          />
        </div>
      )}

      {role === "ROLE_OWNER" && (
        <div className="mb-4">
          <label className="block mb-3">상호명</label>
          <input
            type="text"
            name="businessName"
            className="w-full border rounded px-4 py-2"
            value={formData.businessName || ""}
            onChange={handleChange}
          />
        </div>
      )}

      {/* 휴대폰 */}
      <div className="mb-4">
        <label className="block mb-3">휴대폰 번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="memberPhone"
            className="flex-1 border rounded px-4 py-2"
            value={formData.memberPhone || ""}
            onChange={handleChange}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            인증번호 받기
          </button>
        </div>
      </div>

      {/* 프로필 사진 */}
      <div className="mb-6">
        <label className="block mb-3">프로필 사진</label>
        <div className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
          <FiUpload size={24} />
          <span>클릭하여 업로드</span>
          <span className="text-xs text-gray-400">jpg, png, gif 가능</span>
        </div>
      </div>

      {/* 생년월일 + 성별 */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block mb-3">생년월일</label>
          <input
            type="date"
            name="birthDate"
            className="w-full border rounded px-4 py-2"
            value={formData.birthDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-3">성별</label>
          <select
            name="gender"
            className="w-full border rounded px-4 py-2"
            value={formData.gender || "M"}
            onChange={handleChange}
          >
            <option value="M">남</option>
            <option value="F">여</option>
          </select>
        </div>
      </div>

      {/* 활동영역 + 활동주제 (리뷰어만) */}
      {role === "ROLE_USER" && (
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-3">활동지역</label>
            <input
              type="text"
              name="activityArea"
              className="w-full border rounded px-4 py-2"
              value={formData.activityArea || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-3">활동주제</label>
            <input
              type="text"
              name="activityTopic"
              className="w-full border rounded px-4 py-2"
              value={formData.activityTopic || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* URL */}
      <div className="space-y-3">
        <label className="block">
          {role === "ROLE_USER" ? "리뷰어 URL" : role === "ROLE_OWNER" ? "비즈니스 URL" : "URL"}
        </label>
        {role === "ROLE_USER" ? (
          <>
            <div className="flex items-center gap-2">
              <FaBlogger className="text-green-600 text-3xl" />
              <input
                type="text"
                name="blogUrl"
                placeholder="블로그 URL 입력"
                className="flex-1 border rounded px-4 py-2"
                value={formData.blogUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram className="text-pink-500 text-3xl" />
              <input
                type="text"
                name="instaUrl"
                placeholder="인스타그램 URL 입력"
                className="flex-1 border rounded px-4 py-2"
                value={formData.instaUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaYoutube className="text-red-500 text-3xl" />
              <input
                type="text"
                name="youtubeUrl"
                placeholder="유튜브 URL 입력"
                className="flex-1 border rounded px-4 py-2"
                value={formData.youtubeUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe className="text-blue-500 text-3xl" />
              <input
                type="text"
                name="etcUrl"
                placeholder="기타 URL 입력"
                className="flex-1 border rounded px-4 py-2"
                value={formData.etcUrl || ""}
                onChange={handleChange}
              />
            </div>
          </>
        ) : role === "ROLE_OWNER" ? (
          <input
            type="text"
            name="businessUrl"
            placeholder="비즈니스 URL 입력"
            className="w-full border rounded px-4 py-2"
            value={formData.businessUrl || ""}
            onChange={handleChange}
          />
        ) : null}
      </div>

      {/* 주소 입력: 리뷰어만 */}
      {role === "ROLE_USER" && (
        <div>
          <label className="block mb-3">주소</label>
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              name="zipCode"
              className="w-1/3 border rounded px-4 py-2"
              value={formData.zipCode || ""}
              onChange={handleChange}
            />
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              검색
            </button>
          </div>
          <input
            type="text"
            name="address"
            className="w-full border rounded px-4 py-2 mb-2"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="주소"
          />
          <input
            type="text"
            name="detailAddress"
            className="w-full border rounded px-4 py-2 mb-4"
            value={formData.detailAddress || ""}
            onChange={handleChange}
            placeholder="상세주소"
          />
        </div>
      )}

      {/* 동의 항목 (Tailwind 스위치 적용) */}
      <div className="flex space-x-20">
        <Switch
          name="commentNotificationAgree"
          checked={agree.commentNotificationAgree}
          label="댓글 알림 동의"
        />
        <Switch
          name="pushNotificationAgree"
          checked={agree.pushNotificationAgree}
          label="푸시 알림 동의"
        />
      </div>
      <div>
        <label className="block mb-3">약관 동의</label>
        <Switch
          name="marketingAgree"
          checked={agree.marketingAgree}
          label="마케팅 정보 수신 동의"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-between">
        <button type="button" className="text-gray-400 text-sm px-6 py-2">
          회원탈퇴
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
