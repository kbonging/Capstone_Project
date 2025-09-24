// src/components/mypage/ProfileManageForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { updateMember, deleteMember } from "../../api/memberApi";
import { isEmailExists, sendVerificationCode, verifyAuthCode } from "../../api/authApi";
import { AppContext } from "../../contexts/AppContext";
import { FiUpload } from "react-icons/fi";
import { FaBlogger, FaInstagram, FaYoutube, FaGlobe } from "react-icons/fa";

export default function ProfileManageForm({ user }) {
  const { token, logout } = useContext(AppContext);

  const [formData, setFormData] = useState({});
  const [reviewerChannelList, setReviewerChannelList] = useState([
    { infTypeCodeId: "INF001", channelUrl: "" },
    { infTypeCodeId: "INF002", channelUrl: "" },
    { infTypeCodeId: "INF003", channelUrl: "" },
    { infTypeCodeId: "INF004", channelUrl: "" },
  ]);

  const [agree, setAgree] = useState({
    commentNotificationAgree: false,
    pushNotificationAgree: false,
    marketingAgree: false,
  });

  const [originalFormData, setOriginalFormData] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // 이메일 인증 관련
  const [emailVerified, setEmailVerified] = useState(true); // 초기엔 기존 이메일이라 true
  const [authCode, setAuthCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const role = user?.authDTOList?.[0]?.auth;

  // 초기 데이터 세팅
  useEffect(() => {
    if (user) {
      setFormData(user);

      if (user.reviewerChannelList?.length) {
        const updatedReviewerList = reviewerChannelList.map(ch => ({
          ...ch,
          channelUrl:
            user.reviewerChannelList.find(c => c.infTypeCodeId === ch.infTypeCodeId)
              ?.channelUrl || "",
        }));
        setReviewerChannelList(updatedReviewerList);

        setOriginalFormData({
          ...user,
          reviewerChannelList: updatedReviewerList,
          agree: { ...agree },
        });
      } else {
        setOriginalFormData({
          ...user,
          reviewerChannelList: reviewerChannelList,
          agree: { ...agree },
        });
      }
    }
  }, [user]);

  const checkModified = (newFormData, newReviewerList, newAgree) => {
    if (!originalFormData) return false;
    if (JSON.stringify(newFormData) !== JSON.stringify(originalFormData)) return true;
    if (JSON.stringify(newReviewerList) !== JSON.stringify(originalFormData.reviewerChannelList)) return true;
    if (JSON.stringify(newAgree) !== JSON.stringify(originalFormData.agree)) return true;
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // 닉네임 길이 제한
    if (name === "nickname" && value.length > 8) {
      newValue = value.slice(0, 5);
      alert("닉네임은 8글자까지 입력 가능합니다.");
    }

      setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      setIsModified(checkModified(updated, reviewerChannelList, agree));
      return updated;
    });

    // 이메일 변경 감지 시 인증 필요
    if (name === "memberEmail") {
      setEmailVerified(false);
      setIsCodeSent(false);
      setAuthCode("");
    }
  };
  

const handleSendCode = async (e) => {
  e.preventDefault();
  const email = formData.memberEmail.trim();
  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  const exists = await isEmailExists(email); // Axios response 전체
  console.log("exists:", exists.data);       // 실제 boolean 값 확인
  if (exists.data) {                          // true이면 이미 존재
    alert("이미 사용 중인 이메일입니다.");
    return;
  }

  await sendVerificationCode({ memberEmail: email });
  alert("인증번호가 발송되었습니다.");
  setIsCodeSent(true);
};

  const handleVerifyCode = async () => {
    try {
      const res = await verifyAuthCode({
        memberEmail: formData.memberEmail,
        authCode,
      });
      if (res.data.success) {
        alert("이메일 인증 성공");
        setEmailVerified(true);
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch {
      alert("인증번호 확인 실패");
    }
  };

  const handleChannelChange = (codeId, url) => {
    setReviewerChannelList(prev => {
      const updated = prev.map(ch =>
        ch.infTypeCodeId === codeId ? { ...ch, channelUrl: url } : ch
      );
      setIsModified(checkModified(formData, updated, agree));
      return updated;
    });
  };

  const handleAgreeChange = (e) => {
    const { name, checked } = e.target;
    setAgree(prev => {
      const updated = { ...prev, [name]: checked };
      setIsModified(checkModified(formData, reviewerChannelList, updated));
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      const { memberIdx, ...payloadWithoutIdx } = formData;

      const payload = {
        ...payloadWithoutIdx,
        reviewerChannelList,
      };
      await updateMember(payload, token);
      alert("회원 정보 수정 완료!");
      window.location.reload();
    } catch (err) {
      alert("회원 정보 수정 실패");
    }
  };

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

  function loadDaumPostcode() {
    return new Promise((resolve, reject) => {
      if (window.daum?.Postcode) return resolve();
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Daum Postcode script load 실패"));
      document.head.appendChild(script);
    });
  }

  const handleDeleteMember = async () => {
  if (!window.confirm("정말 회원탈퇴 하시겠습니까?")) {
    return;
  }

  try {
    const res = await deleteMember(token);
    alert(res.data); // "회원 탈퇴가 완료되었습니다."
    logout(); // 🔹 토큰 삭제 + 유저 초기화 + 메인 이동
  } catch (err) {
    console.error(err);
    alert("회원 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl ml-6 space-y-10 text-base text-gray-600 font-medium font-['Noto_Sans_KR',sans-serif]">
      {/* 이메일 */}
      <div className="mb-4">
        <label className="block mb-3">이메일</label>
        <div className="flex gap-2">
          <input
            type="email"
            name="memberEmail"
            className="flex-1 border rounded px-4 py-2"
            value={formData.memberEmail || ""}
            onChange={handleChange}
          />
          {!emailVerified && (
            <button
              type="button"
              onClick={handleSendCode}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              인증번호 받기
            </button>
          )}
        </div>

        {/* 인증번호 입력 */}
        {!emailVerified && isCodeSent && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="인증번호 입력"
              className="flex-1 border rounded px-4 py-2"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              확인
            </button>
          </div>
        )}
      </div>

      {/* 이름 */}
      <div className="mb-4">
        <label className="block mb-3">이름</label>
        <input
          type="text"
          name="memberName"
          className="w-full border rounded px-4 py-2"
          value={formData.memberName || ""}
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
        <input
          type="text"
          name="memberPhone"
          className="w-full border rounded px-4 py-2"
          value={formData.memberPhone || ""}
          onChange={handleChange}
        />
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
      {role === "ROLE_USER" && (
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
      )}

      {/* 활동지역 + 활동주제 (리뷰어만) */}
      {role === "ROLE_USER" && (
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-3">활동지역</label>
            <select
              name="activityArea"
              className="w-full border rounded px-4 py-2"
              value={formData.activityArea || ""}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {[
                "서울","경기","인천","강원","대전","세종","충남","충북",
                "부산","울산","경남","경북","대구","광주","전남","전북","제주"
              ].map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-3">활동주제</label>
            <select
              name="activityTopic"
              className="w-full border rounded px-4 py-2"
              value={formData.activityTopic || ""}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {["맛집","식품","뷰티","여행","디지털","반려동물","기타"].map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-3">소개글</label>
        <textarea
          name="intro"
          value={formData.intro || ""}
          onChange={handleChange}
          placeholder="자신을 소개하는 글을 작성해주세요."
          className="w-full border rounded px-4 py-2 h-24 resize-none"
        />
      </div>

      {/* URL / 채널 */}
      {role === "ROLE_USER" &&
        reviewerChannelList.map(ch => {
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
                onChange={e => handleChannelChange(ch.infTypeCodeId, e.target.value)}
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
              readOnly
              placeholder="우편번호 (검색 버튼 클릭)"
            />
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={async () => {
                try {
                  await loadDaumPostcode();
                  new window.daum.Postcode({
                    oncomplete: (data) => {
                      const addr =
                        data.userSelectedType === "R"
                          ? data.roadAddress
                          : data.jibunAddress;
                      setFormData(prev => ({
                        ...prev,
                        zipCode: data.zonecode,
                        address: addr,
                      }));
                      setIsModified(checkModified({...formData, zipCode: data.zonecode, address: addr}, reviewerChannelList, agree));
                    },
                  }).open();
                } catch {
                  alert("주소 검색 실패");
                }
              }}
            >
              검색
            </button>
          </div>
          <input
            type="text"
            name="address"
            className="w-full border rounded px-4 py-2 mb-2"
            value={formData.address || ""}
            readOnly
            placeholder="기본 주소 (검색 버튼 클릭)"
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
        <button
          onClick={handleDeleteMember}
          className="text-gray-400 text-sm px-6 py-2"
        >
          회원탈퇴
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isModified}
          className={`px-6 py-2 rounded text-white ${
            isModified ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
