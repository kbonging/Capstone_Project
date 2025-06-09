import React, { useState, useRef } from "react";

export default function OwnerFormPage() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    url: "",
    company: "",
    terms1: false,
    terms2: false,
  });

  const [emailAuthVisible, setEmailAuthVisible] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPwdError, setConfirmPwdError] = useState("");


  const emailInputRef = useRef(null);
  const authCodeRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "아이디를 입력하세요.";
    if (!formData.password) newErrors.password = "비밀번호를 입력하세요.";
    if (!formData.confirmPwd) {newErrors.confirmPwd = "비밀번호 확인을 입력하세요."
    } else if (formData.password !==formData.confirmPwd){
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.email) newErrors.email = "이메일을 입력하세요.";
    if (!formData.name) newErrors.name = "이름을 입력하세요.";
    if (!formData.phone) newErrors.phone = "번호를 입력하세요.";
    if (!formData.company) newErrors.company =  "상호명을 입력하세요.";
    if (!formData.terms1 || !formData.terms2) newErrors.terms = true;

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

    if (
      name === "password" || name === "confirmPwd"
    ) {
      if (
        updatedFormData.confirmPwd &&
        updatedFormData.password !== updatedFormData.confirmPwd
      ) {
        setConfirmPwdError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPwdError("");
      }
    }

    return updatedFormData;
  });
};


  const handleEmailAuth = () => {
    if (!formData.email || !emailInputRef.current.checkValidity()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("회원가입이 완료되었습니다!");
    } else {
      alert("필수 항목을 모두 입력해주세요.");
    }
  };

  const isFormValid =
    formData.userId &&
    formData.password &&
    formData.email &&
    formData.name &&
    formData.terms1 &&
    formData.company &&
    formData.phone &&
    formData.confirmPwd &&
    formData.terms2;


  return (
      <main className="max-w-[500px] mx-auto mt-[60px] font-['Noto_Sans_KR']">
        <h2 className="text-[24px] font-bold mb-[30px] border-b border-gray-300 pb-[10px] ">회원가입</h2>
      <form onSubmit={handleSubmit}>


        {/* 아이디 */}
        <label className="font-bold block mb-[10px]" >아이디 *</label>
        <div className="flex gap-2">
          <input name="userId" value={formData.userId} onChange={handleChange} required placeholder="아이디를 입력하세요" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          <button type="button" className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100">중복확인</button>
        </div>
        {errors.userId && <div className="text-xs text-red-500">{errors.userId}</div>}


        {/* 비밀번호 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 *</label>
        <div className="relative">
          <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="비밀번호를 입력하세요" minLength="8" maxLength="30" 
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-none border-none p-0 cursor-pointer">
            <i className={`bx mr-[5px] h-full ${showPassword ? "bx-show" : "bx-hide"}`}></i>
          </button>
        </div>
        {errors.password && <div className="text-xs text-red-500">{errors.password}</div>}

        {/* 비밀번호 확인 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 확인*</label>
        <div className="relative">
          <input name="confirmPwd" type={showPassword ? "text" : "password"} value={formData.confirmPwd} onChange={handleChange} required placeholder="비밀번호를 확인하세요" minLength="8" maxLength="30"
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md">
          </input>
        </div>
        {confirmPwdError && (
          <div className="text-xs text-red-500">{confirmPwdError}</div>)}



        {/* 이메일 */}
        <label className="font-bold block mt-5 mb-[10px]">이메일 *</label>
        <div className="flex gap-2">
          <input name="email" ref={emailInputRef} value={formData.email} onChange={handleChange} required placeholder="이메일을 입력하세요" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="올바른 이메일 주소를 입력하세요 (예: user@example.com)" 
          readOnly={emailLocked} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          <button type="button" className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100" onClick={handleEmailAuth}>인증번호 받기</button>
        </div>
        {errors.email && <div className="text-xs text-red-500">{errors.email}</div>}
        {emailAuthVisible && (
          <div className="mt-2">
            <input type="text" ref={authCodeRef} placeholder="이메일 인증번호 입력" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
            <button type="button" onClick={confirmEmailAuth} className="mt-2 px-4 py-2 border border-gray-800 bg-white rounded-md hover:bg-gray-100 text-sm">이메일 인증 확인</button>
          </div>
        )}

        {/* 이름 */}
        <label className="font-bold block mb-[10px] mt-5">이름 *</label>
        <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
        <div className="text-xs text-gray-500 ml-[5px] mt-[5px]">실명으로 등록하지 않을 경우 리뷰어 인증이 있을 수 있습니다</div>
        {errors.name && <div className="text-xs text-red-500">{errors.name}</div>}
        
        {/* 휴대폰 번호 */}
        <label className="font-bold block mt-5 mb-[10px]">휴대폰 번호 *</label>
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="010-1234-5678" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />


        {/* 홈페이지 url 주소 */}
        <label className="font-bold block mb-[10px] mt-5">네이버 플레이스 / 홈페이지 주소 url</label>
        <input name="url" value={formData.url} onChange={handleChange} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />



        {/* 상호명 */}
        <label className="font-bold block mb-[10px] mt-5">상호명 *</label>
        <input name="company" value={formData.company} onChange={handleChange} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="terms1" checked={formData.terms1} onChange={handleChange} />
            이용약관에 동의합니다 (필수)
            <a href="#" className="ml-auto text-blue-500 text-xs">보기</a>
            {/* 약관들 만들어서 경로 설정해줘야함 */}
          </label>

          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="terms2" checked={formData.terms2} onChange={handleChange} />
            개인정보 처리방침에 동의합니다 (필수)
            <a href="#" className="ml-auto text-blue-500 text-xs">보기</a>
            {/* 약관들 만들어서 경로 설정해줘야함 */}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="terms3" checked={formData.terms3} onChange={handleChange} />
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
