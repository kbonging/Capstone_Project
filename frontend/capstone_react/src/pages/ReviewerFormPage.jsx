import React, { useState, useRef } from "react";

export default function ReviewerFormPage() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPwd: "",
    email: "",
    name: "",
    phone: "",
    birth: "",
    gender: "",
    source: "",
    RevCategory: "",
    platforms: [],
    links: {
      blog: "",
      insta: "",
      youtube: "",
      tiktok: "",
      etc: ""
    },
    terms1: false,
    terms2: false,
    terms3: false
  });

  const [errors, setErrors] = useState({});
  const [confirmPwdError, setConfirmPwdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [emailAuthVisible, setEmailAuthVisible] = useState(false);


  const emailInputRef = useRef(null);
  const authCodeRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "아이디를 입력하세요.";
    if (!formData.password) newErrors.password = "비밀번호를 입력하세요.";
    if (!formData.confirmPwd) {
      newErrors.confirmPwd = "비밀번호 확인을 입력하세요.";
    } else if (formData.password !== formData.confirmPwd) {
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.email) newErrors.email = "이메일을 입력하세요.";
    if (!formData.name) newErrors.name = "이름을 입력하세요.";
    if (!formData.phone) newErrors.phone = "번호를 입력하세요.";

    if (!formData.terms1 || !formData.terms2) newErrors.terms = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("link-")) {
      const key = name.split("link-")[1];
      setFormData((prev) => ({
        ...prev,
        links: { ...prev.links, [key]: value }
      }));
    } else {
      setFormData((prev) => {
        const updated = {
          ...prev,
          [name]: type === "checkbox" ? checked : value
        };

        if (name === "password" || name === "confirmPwd") {
          if (updated.confirmPwd && updated.password !== updated.confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
          } else {
            setConfirmPwdError("");
          }
        }

        return updated;
      });
    }
  };

  const togglePlatform = (platform) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(platform);
      const newList = exists
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return {
        ...prev,
        platforms: newList
      };
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
    alert("이메일 인증 확인");
    setEmailAuthVisible(false);
    setEmailLocked(true);
  };


// 인증이 성공한 경우에만 사라지게 하는 방법(봉중이랑 같이)
// const confirmEmailAuth = () => {
//   const inputCode = authCodeRef.current?.value;
//   const actualCode = "123456"; // 서버로부터 받은 실제 인증번호라 가정
//   if (inputCode === actualCode) {
//     alert("이메일 인증 완료");
//     setEmailAuthVisible(false);
//     setEmailLocked(true);
//   } else {
//     alert("인증번호가 올바르지 않습니다.");
//   }
// };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert("리뷰어 회원가입 완료!");
  };

  const isFormValid =
    formData.userId &&
    formData.password &&
    formData.confirmPwd &&
    formData.email &&
    formData.name &&
    formData.phone &&
    formData.terms1 &&
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

        <div className="flex gap-4 mt-6">
          <div className="w-1/2">
            <label className="font-semibold">생년월일</label>
            <input type="date" name="birth" value={formData.birth} onChange={handleChange} className="border px-3 py-2 rounded-md w-full mt-1" />
          </div>
          <div className="w-1/2">
            <label className="font-semibold">성별</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> 남
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> 여
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold mt-6 block">리뷰어 유형 *</label>
          <div className="flex gap-4 mt-2 mb-6 overflow-x-auto pb-2">
            {['blog', 'insta', 'youtube', 'tiktok', 'etc'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => togglePlatform(type)}
                className={`platform-btn flex flex-col justify-center items-center border rounded-full px-4 py-3 w-24 h-24 text-xs hover:shadow-md transition ${formData.platforms.includes(type) ? 'bg-blue-100 font-semibold' : ''}`}
              >
                <img src={`https://cdn-icons-png.flaticon.com/512/${{
                  blog: '733/733579',
                  insta: '2111/2111463',
                  youtube: '1384/1384060',
                  tiktok: '3046/3046121',
                  etc: '565/565547'
                }[type]}.png`} alt={type} className="w-8 h-8 mb-1" />
                {type === 'insta' ? '인스타그램' : type === 'etc' ? '기타' : type === 'blog' ? '블로그' : type === 'youtube' ? '유튜브' : '틱톡'}
              </button>
            ))}
          </div>
        </div>

        {formData.platforms.map((type) => (
          <div key={type} className="mb-4">
            <label className="font-semibold">{type === 'insta' ? '인스타그램 주소' : type === 'etc' ? '기타 SNS 주소' : type === 'blog' ? '블로그 주소' : type === 'youtube' ? '유튜브 주소' : '틱톡 주소'}</label>
            <input
              name={`link-${type}`}
              type="url"
              value={formData.links[type]}
              onChange={handleChange}
              placeholder={`https://www.${type}.com/...`}
              className="border px-3 py-2 rounded-md w-full mt-1"
            />
          </div>
        ))}

        {/* <div>
          <label className="font-semibold">가입경로 *</label>
          <select name="source" value={formData.source} onChange={handleChange} className="border px-3 py-2 rounded-md w-full mt-1 mb-4" required>
            <option value="">선택</option>
            <option value="지인 추천">지인 추천</option>
            <option value="검색">검색</option>
            <option value="SNS">SNS</option>
            <option value="기타">기타</option>
          </select>
        </div> */}

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
