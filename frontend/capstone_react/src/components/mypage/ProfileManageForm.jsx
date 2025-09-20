import React, { useState, useEffect, useContext } from "react";
import { updateMember } from "../../api/memberApi";
import { AppContext } from "../../contexts/AppContext";
import { FiUpload } from "react-icons/fi";
import { FaBlogger, FaInstagram, FaYoutube, FaGlobe } from "react-icons/fa";

export default function ProfileManageForm({ user }) {
  const { token } = useContext(AppContext);

  const [formData, setFormData] = useState({});
  const [reviewerChannelList, setReviewerChannelList] = useState([
    { infTypeCodeId: "INF001", channelUrl: "" },
    { infTypeCodeId: "INF002", channelUrl: "" },
    { infTypeCodeId: "INF003", channelUrl: "" },
    { infTypeCodeId: "INF004", channelUrl: "" },
  ]);

  // 동의 체크 상태
  const [agree, setAgree] = useState({
    commentNotificationAgree: false,
    pushNotificationAgree: false,
    marketingAgree: false,
  });

  useEffect(() => {
    if (user) {
      setFormData(user);

      if (user.reviewerChannelList?.length) {
        setReviewerChannelList(prev =>
          prev.map(ch => ({
            ...ch,
            channelUrl:
              user.reviewerChannelList.find(c => c.infTypeCodeId === ch.infTypeCodeId)
                ?.channelUrl || "",
          }))
        );
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChannelChange = (codeId, url) => {
    setReviewerChannelList(prev =>
      prev.map(ch =>
        ch.infTypeCodeId === codeId ? { ...ch, channelUrl: url } : ch
      )
    );
  };

  const handleAgreeChange = (e) => {
    const { name, checked } = e.target;
    setAgree(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        reviewerChannelList,
        ...agree, // 동의 상태도 함께 전송 가능
      };
      await updateMember(payload, token);
      alert("회원 정보 수정 완료!");
    } catch (err) {
      alert("회원 정보 수정 실패");
    }
  };

  const role = user?.authDTOList?.[0]?.auth;

  // 동의 스위치
  const Switch = ({ name, checked, label }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleAgreeChange}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="max-w-2xl ml-6 space-y-10 text-base text-gray-600 font-medium font-['Noto_Sans_KR',sans-serif]">
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

      {/* 이름 */}
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

      {/* 닉네임 / 상호명 */}
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

      {/* 활동지역 + 활동주제 (리뷰어만) */}
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

      {/* URL / 채널 */}
      {role === "ROLE_USER" &&
        reviewerChannelList.map((ch) => {
          const Icon =
            ch.infTypeCodeId === "INF001"
              ? FaBlogger
              : ch.infTypeCodeId === "INF002"
              ? FaInstagram
              : ch.infTypeCodeId === "INF003"
              ? FaYoutube
              : FaGlobe;

          const placeholder =
            ch.infTypeCodeId === "INF001"
              ? "블로그 URL 입력"
              : ch.infTypeCodeId === "INF002"
              ? "인스타그램 URL 입력"
              : ch.infTypeCodeId === "INF003"
              ? "유튜브 URL 입력"
              : "기타 URL 입력";

          return (
            <div key={ch.infTypeCodeId} className="flex items-center gap-2 mb-2">
              <Icon className="text-3xl" />
              <input
                type="text"
                value={ch.channelUrl}
                placeholder={placeholder}
                className="flex-1 border rounded px-4 py-2"
                onChange={(e) => handleChannelChange(ch.infTypeCodeId, e.target.value)}
              />
            </div>
          );
        })}

      {role === "ROLE_OWNER" && (
        <div className="mb-4">
          <label className="block mb-3">비즈니스 URL</label>
          <input
            type="text"
            name="businessUrl"
            className="w-full border rounded px-4 py-2"
            value={formData.businessUrl || ""}
            onChange={handleChange}
          />
        </div>
      )}

      {/* 주소 (리뷰어만) */}
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
            <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">검색</button>
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

      {/* 동의 스위치 */}
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
        <button className="text-gray-400 text-sm px-6 py-2">회원탈퇴</button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
