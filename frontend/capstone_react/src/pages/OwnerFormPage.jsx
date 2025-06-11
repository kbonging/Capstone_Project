import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signUpOwner, checkDuplicateId } from "../api/ownerApi"; 

export default function OwnerFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberId: "",
    memberPwd: "",
    memberName: "",
    memberEmail: "",
    memberPhone: "",
    businessName: "",
    businessUrl: ""
  });

  const [emailAuthVisible, setEmailAuthVisible] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPwdError, setConfirmPwdError] = useState("");

  const [terms1, setTerms1] = useState(false);
  const [terms2, setTerms2] = useState(false);
  const [terms3, setTerms3] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState("");

  // ID 중복 확인 관련 상태 추가
  const [idDuplicateMessage, setIdDuplicateMessage] = useState(""); // 중복 확인 메시지
  const [isIdChecked, setIsIdChecked] = useState(false); // ID 중복 확인 여부

  const emailInputRef = useRef(null);
  const authCodeRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.memberId.trim()) { // 아이디가 비어있거나 공백만 있을 때
      newErrors.memberId = "아이디를 입력하세요.";
    } else if (!isIdChecked) { // 아이디는 입력되었지만 중복 확인을 하지 않았을 때
      newErrors.memberId = "아이디 중복 확인을 해주세요.";
    } else if (idDuplicateMessage === "이미 사용 중인 아이디입니다.") { // 중복 확인 결과가 중복일 때
      newErrors.memberId = idDuplicateMessage; 
    }
    // ... (나머지 유효성 검사 로직)
    if (!formData.memberPwd) newErrors.memberPwd = "비밀번호를 입력하세요.";
    if (!confirmPwd) {newErrors.confirmPwd = "비밀번호 확인을 입력하세요."
    } else if (formData.memberPwd !==confirmPwd){
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.memberEmail) newErrors.memberEmail = "이메일을 입력하세요.";
    if (!formData.memberName) newErrors.memberName = "이름을 입력하세요.";
    if (!formData.memberPhone) newErrors.memberPhone = "번호를 입력하세요.";
    if (!formData.businessName) newErrors.businessName =  "상호명을 입력하세요.";
    if (!formData.businessUrl) newErrors.businessUrl = "홈페이지 URL을 입력하세요.";

    if (!terms1 || !terms2) newErrors.terms = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: newValue,
      };

      if (name === "memberId") {
        // ID 값이 변경되면 중복 확인 상태 초기화
        setIsIdChecked(false);
        setIdDuplicateMessage("");
        setErrors((prev) => ({ ...prev, memberId: "" })); // ID 관련 에러 메시지 초기화
      }

      if (
        name === "memberPwd" || name === "confirmPwd"
      ) {
        if (
          updatedFormData.confirmPwd &&
          updatedFormData.memberPwd !== updatedFormData.confirmPwd
        ) {
          setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
          setConfirmPwdError("");
        }
      }

      return updatedFormData;
    });
  };

  const handleCheckDuplicateId = async () => {
    if (!formData.memberId.trim()) { // .trim()을 사용하여 공백만 있는 경우도 체크
      setIdDuplicateMessage("아이디를 입력해주세요.");
      setErrors((prev) => ({
        ...prev,
        memberId: "아이디를 입력해주세요.",
      }));
      setIsIdChecked(false);
      return; 
    }

    try {
      // 임포트한 checkDuplicateId 함수를 호출합니다.
      const isDuplicate = await checkDuplicateId(formData.memberId);
      if (isDuplicate) {
        setIdDuplicateMessage("이미 사용 중인 아이디입니다.");
        setErrors((prev) => ({ ...prev, memberId: "이미 사용 중인 아이디입니다." }));
        setIsIdChecked(false);
      } else {
        setIdDuplicateMessage("사용 가능한 아이디입니다.");
        setErrors((prev) => ({ ...prev, memberId: "" })); // 에러 메시지 초기화
        setIsIdChecked(true);
      }
    } catch (error) {
      console.error("ID 중복 확인 API 호출 실패:", error); // 실제 에러를 콘솔에 출력
      setIdDuplicateMessage("ID 중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setErrors((prev) => ({ ...prev, memberId: "ID 중복 확인 중 오류가 발생했습니다." }));
      setIsIdChecked(false);
    }
  }

  const handleEmailAuth = () => {
    if (!formData.memberEmail || !emailInputRef.current.checkValidity()) {
      emailInputRef.current.reportValidity();
      return;
    }
    setEmailAuthVisible(true);
  };

  const confirmEmailAuth = () => {
    setEmailLocked(true);
    if (authCodeRef.current) authCodeRef.current.readOnly = true;
    alert("이메일이 인증되었습니다.");
    setEmailAuthVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 회원가입 제출 전 ID 중복 확인 상태 다시 검증
    if (!isIdChecked || idDuplicateMessage === "이미 사용 중인 아이디입니다.") {
      alert(idDuplicateMessage || "아이디 중복 확인을 해주세요.");
      return;
    }

    if (validate()) {
      const requestbody = {
        memberId: formData.memberId,
        memberPwd: formData.memberPwd,
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberPhone: formData.memberPhone,
        businessName: formData.businessName,
        businessUrl: formData.businessUrl,
      }
      try {
        await signUpOwner(requestbody);
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } catch (error) {
        // 회원가입 API 호출 실패 시 에러 처리
        alert("회원가입 중 오류가 발생했습니다: " + (error.response?.data?.message || error.message));
      }
    } else {
      alert("필수 항목을 모두 입력해주세요.");
    }
  };

  const isFormValid =
    formData.memberId &&
    isIdChecked && // ID 중복 확인이 완료되어야 함
    !errors.memberId && // ID 관련 에러 메시지가 없어야 함
    formData.memberPwd &&
    formData.memberEmail &&
    formData.memberName &&
    formData.memberPhone &&
    formData.businessName &&
    formData.businessUrl &&
    confirmPwd &&
    terms1 &&
    terms2;


  return (
      <main className="max-w-[500px] mx-auto mt-[60px] font-['Noto_Sans_KR']">
        <h2 className="text-[24px] font-bold mb-[30px] border-b border-gray-300 pb-[10px] ">회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <label className="font-bold block mb-[10px]" >아이디 *</label>
        <div className="flex gap-2">
          <input name="memberId" value={formData.memberId} onChange={handleChange} required placeholder="아이디를 입력하세요" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          <button type="button" onClick={handleCheckDuplicateId} className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100">중복확인</button>
        </div>
        {idDuplicateMessage && (
            <div className={`text-xs mt-1 ${isIdChecked ? "text-green-500" : "text-red-500"}`}>
                {idDuplicateMessage}
            </div>
        )}
        {/* errors.memberId는 validate 함수에서 설정될 수 있으므로 별도로 표시 */}
        {errors.memberId && idDuplicateMessage !== errors.memberId && <div className="text-xs text-red-500">{errors.memberId}</div>}


        {/* 비밀번호 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 *</label>
        <div className="relative">
          <input name="memberPwd" type={showPassword ? "text" : "password"} value={formData.memberPwd} onChange={handleChange} required placeholder="비밀번호를 입력하세요" minLength="8" maxLength="30" 
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-none border-none p-0 cursor-pointer">
            <i className={`bx mr-[5px] h-full ${showPassword ? "bx-show" : "bx-hide"}`}></i>
          </button>
        </div>
        {errors.memberPwd && <div className="text-xs text-red-500">{errors.memberPwd}</div>}

        {/* 비밀번호 확인 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 확인*</label>
        <div className="relative">
          <input name="confirmPwd" type={showPassword ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required placeholder="비밀번호를 확인하세요" minLength="8" maxLength="30"
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md">
          </input>
        </div>
        {confirmPwdError && (
          <div className="text-xs text-red-500">{confirmPwdError}</div>)}



        {/* 이메일 */}
        <label className="font-bold block mt-5 mb-[10px]">이메일 *</label>
        <div className="flex gap-2">
          <input name="memberEmail" ref={emailInputRef} value={formData.memberEmail} onChange={handleChange} required placeholder="이메일을 입력하세요" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="올바른 이메일 주소를 입력하세요 (예: user@example.com)" 
          readOnly={emailLocked} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          <button type="button" className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100" onClick={handleEmailAuth}>인증번호 받기</button>
        </div>
        {errors.memberEmail && <div className="text-xs text-red-500">{errors.memberEmail}</div>}
        {emailAuthVisible && (
          <div className="mt-2">
            <input type="text" ref={authCodeRef} placeholder="이메일 인증번호 입력" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
            <button type="button" onClick={confirmEmailAuth} className="mt-2 px-4 py-2 border border-gray-800 bg-white rounded-md hover:bg-gray-100 text-sm">이메일 인증 확인</button>
          </div>
        )}

        {/* 이름 */}
        <label className="font-bold block mb-[10px] mt-5">이름 *</label>
        <input name="memberName" value={formData.memberName} onChange={handleChange} required className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
        <div className="text-xs text-gray-500 ml-[5px] mt-[5px]">실명으로 등록하지 않을 경우 소상공인 인증이 있을 수 있습니다</div>
        {errors.memberName && <div className="text-xs text-red-500">{errors.memberName}</div>}
        
        {/* 휴대폰 번호 */}
        <label className="font-bold block mt-5 mb-[10px]">휴대폰 번호 *</label>
        <input name="memberPhone" value={formData.memberPhone} onChange={handleChange} placeholder="010-1234-5678" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />


        {/* 홈페이지 url 주소 */}
        <label className="font-bold block mb-[10px] mt-5">홈페이지 주소 url</label>
        <input name="businessUrl" value={formData.businessUrl} onChange={handleChange} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />



        {/* 상호명 */}
        <label className="font-bold block mb-[10px] mt-5">상호명 *</label>
        <input name="businessName" value={formData.businessName} onChange={handleChange} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="terms1" checked={terms1} onChange={(e) => setTerms1(e.target.checked)} />
            이용약관에 동의합니다 (필수)
            <a href="#" className="ml-auto text-blue-500 text-xs">보기</a>
            {/* 약관들 만들어서 경로 설정해줘야함 */}
          </label>

          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="terms2" checked={terms2} onChange={(e) => setTerms2(e.target.checked)} />
            개인정보 처리방침에 동의합니다 (필수)
            <a href="#" className="ml-auto text-blue-500 text-xs">보기</a>
            {/* 약관들 만들어서 경로 설정해줘야함 */}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="terms3" checked={terms3} onChange={(e) => setTerms3(e.target.checked)} />
            마케팅 정보 수신에 동의합니다 (선택)
            <a href="#" className="ml-auto text-blue-500 text-xs">보기</a>
            {/* 약관들 만들어서 경로 설정해줘야함 */}
          </label>

          {errors.terms && <div className="text-xs text-red-500 mt-1">약관에 모두 동의해주세요.</div>}
        </div>

        <button
          type="submit"
          className="w-full h-[42px] mt-[30px] bg-blue-500 rounded-lg text-white font-bold text-[16px] disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!isFormValid}
        >
          회원가입
        </button>
      </form>
    </main>
  );
}