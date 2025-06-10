// src/components/mypage/ProfileManageForm.jsx
import React from 'react';

export default function ProfileManageForm() {
  return (
    <form className="space-y-6 max-w-xl">
      {/* 이메일 */}
      <div>
        <label className="block text-sm mb-1">이메일</label>
        <input
          type="email"
          className="w-full border rounded px-4 py-2 bg-gray-100"
          value="namguk44@planetaway.appleid.com"
          readOnly
        />
      </div>

      {/* 이름 */}
      <div>
        <label className="block text-sm mb-1">이름</label>
        <input
          type="text"
          className="w-full border rounded px-4 py-2"
          placeholder="이름을 입력하세요"
        />
      </div>

      {/* 휴대폰 번호 */}
      <div>
        <label className="block text-sm mb-1">휴대폰 번호</label>
        <div className="flex gap-2">
          <input
            type="tel"
            className="w-full border rounded px-4 py-2"
            placeholder="010-1234-5678"
          />
          <button className="border rounded px-4 py-2 text-sm">
            인증번호 받기
          </button>
        </div>
      </div>

      {/* 프로필 사진 업로드 */}
      <div>
        <label className="block text-sm mb-1">프로필 사진</label>
        <label
          htmlFor="profileImage"
          className="cursor-pointer block border-dashed border-2 border-gray-300 rounded p-6 text-center text-sm text-gray-500 hover:bg-gray-50"
        >
          이미지 업로드 영역 (JPG, PNG 최대 10MB)
          <br />
          <span className="text-blue-500 underline">클릭해서 파일 선택</span>
        </label>
        <input
          id="profileImage"
          type="file"
          className="hidden"
          accept="image/*"
        />
      </div>

      {/* 소개글 */}
      <div>
        <label className="block text-sm mb-1">소개글</label>
        <textarea
          className="w-full border rounded px-4 py-2"
          rows="4"
          placeholder="자기소개를 입력해주세요."
        />
      </div>

      {/* 닉네임 */}
      <div>
        <label className="block text-sm mb-1">닉네임</label>
        <input
          type="text"
          className="w-full border rounded px-4 py-2"
          defaultValue="namguk"
        />
      </div>

      {/* 알림 수신 동의 */}
      <div className="flex items-center justify-between">
        <label className="text-sm">알림 수신 동의</label>
        <input type="checkbox" className="toggle toggle-sm" defaultChecked />
      </div>

      {/* 전체 약관 동의 */}
      <div className="text-sm">
        <label className="inline-flex items-center">
          <input type="checkbox" className="mr-2" />
          전체 약관에 동의합니다.
        </label>
      </div>

      {/* 제출 버튼 */}
      <div className="pt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          수정하기
        </button>
      </div>
    </form>
  );
}
