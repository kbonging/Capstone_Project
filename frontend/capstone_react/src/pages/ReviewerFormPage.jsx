import React, { useState, useRef, useEffect } from "react";
import { checkDuplicateId, isEmailExists, sendVerificationCode, verifyAuthCode } from "../api/authApi";
import { signUpReviewer } from "../api/reviewerApi";
import { validateInput, formatPhoneNumber } from "../utils/common";
import {useNavigate} from "react-router-dom";

export default function ReviewerFormPage() {
  const platformList = [ // 추후 공통코드 항목으로 가져올 예정
    {
      code_id: 'INF001',
      code_nm: '블로그',
      image_url: 'https://cdn-icons-png.flaticon.com/512/2593/2593549.png'
    },
    {
      code_id: 'INF002',
      code_nm: '인스타',
      image_url: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png'
    },
    {
      code_id: 'INF003',
      code_nm: '유튜브',
      image_url: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
    },
    {
      code_id: 'INF004',
      code_nm: '기타',
      image_url: 'https://cdn-icons-png.flaticon.com/512/565/565547.png'
    }
  ];

  const [formData, setFormData] = useState({
    memberId: "",
    memberPwd: "",
    confirmPwd: "",
    memberEmail: "",
    memberName: "",
    nickname: "",
    memberPhone: "",
    birthDate: "",
    gender: "",
    // RevCategory: "", //-> 이거 뭐임? - 봉
    platforms: [], // ['INF001', 'INF002'] // 해당 유형을 체크 했는지 안했는지 저장
    links: {      // 각 유형에 대한 실제 URL을 저장
      INF001: "",
      INF002: "",
      INF003: "",
      INF004: "",
    },
    terms1: false,
    terms2: false,
    terms3: false
  });

  // 전송 데이터 생성
  const createSubmitPayload = (formData) => {
    return {
      memberId: formData.memberId,
      memberPwd: formData.memberPwd,
      memberName: formData.memberName,
      nickname: formData.nickname,
      memberEmail: formData.memberEmail,
      memberPhone: formData.memberPhone,
      gender: formData.gender,
      birthDate: formData.birthDate,
      reviewerChannelList: formData.platforms
        .filter((codeId) => formData.links[codeId]?.trim()) // 링크가 존재하는 경우만 포함
        .map((codeId) => ({
          infTypeCodeId: codeId,
          channelUrl: formData.links[codeId].trim()
        }))
    };
  };

  const [errors, setErrors] = useState({}); 
  const [confirmPwdError, setConfirmPwdError] = useState("");   // 비밀번호, 비밀번호 확인 값 일치 여부상태
  const [showmemberPwd, setShowmemberPwd] = useState(false); 
  const nav = useNavigate();

  // ########## 아이디 중복 체크 관련 ############ //
  const [memberIdChecked, setMemberIdChecked] = useState(false);  // 아이디 중복 체크 상태
  const [idCheckMessage, setIdCheckMessage] = useState("");       // 중복 확인 결과 메시지
  //###########################################//

  //############## 이메일 관련 ###############//
  const [emailVerified, setEmailVerified] = useState(false);      // 이메일 인증 상태
  const [isSending, setIsSending] = useState(false);              // 이메일 인증 코드 전송 중임을 나타내는 상태
  const [cooldown, setCooldown] = useState(0);                    // 재전송 쿨타임 카운트
  const [emailAuthMessage, setEmailAuthMessage] = useState("");   // 이메일 인증 관련 안내 메시지 저장 상태
  const [emailAuthVisible, setEmailAuthVisible] = useState(false); // 이메일 인증(코드 입력) 폼 표시 여부 상태
  const [emailLocked, setEmailLocked] = useState(false);           // 이메일 입력창 활성/비활성화 상태
  const emailInputRef = useRef(null);                             // 이메일 입력폼 참조
  const authCodeRef = useRef(null);                               // 인증코드 접근하기 위해 만듦
  const [authExpireCountdown, setAuthExpireCountdown] = useState(0); // 인증번호 유효시간(초 단위)을 관리하는 상태값
  // 인증번호 유효시간 타이머 ID를 저장하는 ref
  // 타이머 중복 실행 방지 및 클리어 용도로 사용
  const authExpireTimerRef = useRef(null);  

  //################ useEffect ####################//
  // 1️⃣ 인증번호 재전송 제한 (cooldown: 재전송 대기 시간 초 단위)
  useEffect(() => {
    if (cooldown <= 0) return; // 남은 시간이 없으면 타이머 시작 안 함

    // 1초마다 cooldown 값을 1씩 감소시키는 interval 설정
    const interval = setInterval(() => {
      setCooldown(prev => prev - 1); // cooldown 상태 1초씩 감소
    }, 1000);

    // cleanup: cooldown이 바뀔 때마다 이전 interval 제거 (중복 방지)
    return () => clearInterval(interval);
  }, [cooldown]);

  // 2️⃣ cooldown 값이 0이 되면 인증 버튼을 다시 활성화
  useEffect(() => {
    if (cooldown === 0) {
      setIsSending(false); // 인증번호 전송 버튼 활성화
    }
  }, [cooldown]);

  // 3️⃣ 인증번호 유효시간 타이머 (authExpireCountdown: 인증번호 남은 유효 시간 초 단위)
  useEffect(() => {
    if (authExpireCountdown <= 0) return; // 타이머가 0이거나 음수이면 실행하지 않음

    // 1초마다 authExpireCountdown 값을 감소시키는 interval 설정
    const interval = setInterval(() => {
      setAuthExpireCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // 마지막 1초 감소 후 interval 제거
          return 0;
        }
        return prev - 1; // 유효 시간 감소
      });
    }, 1000);

    // cleanup: authExpireCountdown이 바뀔 때마다 이전 interval 제거
    return () => clearInterval(interval);
  }, [authExpireCountdown]);
  /////////////////////////////////////////////

  // 해당 유형 선택 및 링크 입력 유효성 검사 함수
  const checkPlatformInputs = (platforms, links) => {
    if (!platforms || platforms.length === 0) {
      return "최소 1개의 유형을 선택하세요.";
    }
    const emptyUrls = platforms.filter((codeId) => 
      !links[codeId] || links[codeId].trim() === "" // 선택한 유형의 URL이 없는 경우를 반환
    );
    if (emptyUrls.length > 0) {
      return "선택한 유형의 링크를 모두 입력하세요.";
    }
    return null; // 문제가 없을 경우
  };

  // 입력값 유효성 검사
  const validate = () => {
    const newErrors = {};
    if (!formData.memberId.trim()){
      newErrors.memberId = "아이디를 입력하세요.";
    }else if(!memberIdChecked){
      newErrors.memberId = "아이디 중복 확인을 해주세요.";
    }
    if (!formData.memberPwd) newErrors.memberPwd = "비밀번호를 입력하세요.";
    if (!formData.confirmPwd) {
      newErrors.confirmPwd = "비밀번호 확인을 입력하세요.";
    } else if (formData.memberPwd !== formData.confirmPwd) {
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.memberEmail) newErrors.memberEmail = "이메일을 입력하세요.";
    if (!formData.memberName) newErrors.memberName = "이름을 입력하세요.";
    if(!validateInput(formData.memberName, '^[가-힣]+$')){
      newErrors.memberName = "이름은 한글만 입력 가능합니다.";
    }
    if (!formData.nickname) newErrors.nickname = "닉네임을 입력하세요.";
    if (!formData.memberPhone) newErrors.memberPhone = "번호를 입력하세요.";
    if(!validateInput(formData.memberPhone, '^\\d{10,11}$')){
      newErrors.memberPhone = "10~11자리 숫자만 입력가능합니다.";
    }

    // 유형 선택 검사
    const platformError = checkPlatformInputs(formData.platforms, formData.links);
    if(platformError){
      newErrors.platform = platformError;
    }

    if (!formData.terms1 || !formData.terms2) newErrors.terms = true; // 약관 동의
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 입력 핸들러 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "memberId"){
      setMemberIdChecked(false);  // 아이디 값이 바뀌면 다시 체크
      setIdCheckMessage("");
      setErrors((prev) => ({ ...prev, memberId: "" }));
    } 

    if (name === "memberPhone") {
      // 숫자만 필터링
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNums
      }));
      return; // 이 조건문 통과 시 나머지 로직 실행 안 하도록 종료
    }
  
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
        if (name === "memberPwd" || name === "confirmPwd") {
          if (updated.confirmPwd && updated.memberPwd !== updated.confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
          } else {
            setConfirmPwdError("");
          }
        }
        return updated;
      });
    }
  };

  // 플랫폼 선택 토글 함수
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

 // ########### 이메일 관련 시작 ############## //
  // ***** 이메일 전송 버튼 핸들러 ***** //
  const handleEmailAuth = async () => {
    const memberEmail = formData.memberEmail;
    if (!memberEmail || !emailInputRef.current.checkValidity()) {
      emailInputRef.current.reportValidity();
      return;
    }

    try{
      const res = await isEmailExists(memberEmail);
      // console.log("아이디 존재 여부 : "+res.data);
      if(res.data){ 
        // 이메일이 이미 존재하면 에러 메시지 출력
        setErrors((prev) => ({...prev, memberEmail: '이미 사용중인 이메일 입니다.'}));
        setEmailAuthVisible(false);
      }else{
        setAuthExpireCountdown(300); // 타이머 시작 (5분)
        // 인증번호 전송 직후
        clearTimeout(authExpireTimerRef.current); // 혹시 이전 타이머가 있다면 제거
        authExpireTimerRef.current = setTimeout(() => {
          setAuthExpireCountdown(0); // 시간 상태도 0으로
          setEmailAuthVisible(false); // 입력창 숨김
          setEmailVerified(false);    // 인증된 상태 초기화
          setErrors((prev) => ({...prev, memberEmail: '인증번호가 만료되었습니다. 다시 인증해주세요.'}));
        }, 300 * 1000); // 정확히 5분 뒤 실행

        setErrors((prev) => ({...prev, memberEmail: ''})); // 이메일 중복이 없으면 에러 메시지 초기화 
        setEmailAuthVisible(true); // 인증 폼 표시
        setIsSending(true);       // 버튼 비활성화
        setCooldown(10);
        setEmailAuthMessage("인증번호가 발송되었습니다. 다소 시간이 걸릴 수 있습니다.")
        setCooldown(10); // 인증번호 재전송 제한 시간(초) 10초로 초기화하여 카운트다운 시작
        
        // 인증코드 전송 API 호출
        const sendRes = await sendVerificationCode({ memberEmail });
        if(!sendRes.data.success) alert("이메일 전송 중 오류가 발생하였습니다. 만일 문제가 계속될 경우 고객센터(02-1234-5678)로 연락해주세요.");
      }
    }catch (e){
      console.error(e);
    }
  };

  // ********* 이메일 인증 코드 검증 ********** //
  const confirmEmailAuth = async () => {
    const inputCode = authCodeRef.current?.value; // 인증번호 입력값 추출
    const memberEmail = formData.memberEmail;
    if(!inputCode || !memberEmail){
      setEmailAuthMessage("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }

    try{
      const res = await verifyAuthCode({memberEmail: memberEmail, authCode:inputCode});
      if(res.data.success){
        setEmailAuthVisible(false); // 인증 입력창 숨김
        setEmailLocked(true);       // 이메일 입력창 비활성화
        setEmailVerified(true);     // 인증 상태 ture

        // 🔔 5분 뒤 인증 만료 타이머 설정
        setTimeout(() => {
          setEmailVerified(false);         // 인증 상태 false
          setEmailLocked(false);           // 이메일 입력창 활성화
          setEmailAuthVisible(true);       // 인증 입력창 다시 보이기
          setEmailAuthMessage("인증이 만료되었습니다. 다시 인증해주세요.");
        }, 5 * 60 * 1000); // 5분 (300,000ms)
      }else{
        setEmailAuthMessage(res.data.message);
      }
    }catch (e){
      console.error(e);
    }
  };
 // ########### 이메일 관련 함수 끝 ############## //

  // 아이디 중복 확인 버튼 이벤트
  const handleCheckDuplicateId = async () => {
    if (!formData.memberId) {
      setIdCheckMessage("아이디를 입력해주세요.");
      return;
    }
    if (!validateInput(formData.memberId, /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,15}$/)) {
      setIdCheckMessage("아이디는 소문자와 숫자 조합 8~15자리여야 합니다.");
      setMemberIdChecked(false);
      return;
    }
    try {
      const response = await checkDuplicateId(formData.memberId);
      if (response.data) {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
        setMemberIdChecked(false);
      } else {
        setIdCheckMessage("사용 가능한 아이디입니다.");
        setMemberIdChecked(true);
      }
    } catch (error) {
      console.error(error);
      alert("아이디 중복 체크 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 숫자만 입력된 전화번호 "-" 넣어서 변경 (10~11자리만)
    const formattedPhoneNumber = formatPhoneNumber(formData.memberPhone);
    const payload = {
      ...createSubmitPayload(formData),
      memberPhone:formattedPhoneNumber,
    }
    console.log("전송 payload:", payload);

    try {
      await signUpReviewer(payload);
      alert("리뷰어 회원가입이 완료되었습니다.");
      // TODO: 회원가입 후 페이지 이동 등 추가 처리
      nav("/login"); // 예: react-router-dom 사용 시
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다. 만일 문제가 계속될 경우 고객센터(02-1234-5678)로 연락해주세요.");
    }
  };

  // 모두 입력 & 약관 동의 검증 (회원가입 버튼 활성화)
  const isFormValid =
    formData.memberId &&
    memberIdChecked &&
    formData.memberPwd &&
    formData.confirmPwd &&
    formData.memberEmail &&
    formData.memberName &&
    formData.nickname &&
    formData.memberPhone &&
    formData.platforms.length > 0 &&
    !checkPlatformInputs(formData.platforms, formData.links) &&
    emailVerified &&
    formData.terms1 &&
    formData.terms2;

  return (
    <main className="max-w-[500px] mx-auto mt-[60px] font-['Noto_Sans_KR']">
      <h2 className="text-[24px] font-bold mb-[30px] border-b border-gray-300 pb-[10px] ">회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <label className="font-bold block mb-[10px]" >아이디 *</label>
        <div className="flex gap-2">
          <input name="memberId" value={formData.memberId} onChange={handleChange} required placeholder="아이디를 입력하세요" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          <button type="button" onClick={()=>{handleCheckDuplicateId()}} className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100">중복확인</button>
        </div>
        {errors.memberId && <div className="text-xs ml-1 mt-1 text-red-500">{errors.memberId}</div>}
        {idCheckMessage && (
          <span className={`text-xs  ml-1 block ${
            memberIdChecked ? "text-blue-500" : "text-red-500"
            }`} >
            {idCheckMessage}
          </span>
        )}

        {/* 비밀번호 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 *</label>
        <div className="relative">
          <input name="memberPwd" type={showmemberPwd ? "text" : "password"} value={formData.memberPwd} onChange={handleChange} required placeholder="비밀번호를 입력하세요" minLength="8" maxLength="30" 
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

          <button type="button" onClick={() => setShowmemberPwd(!showmemberPwd)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-none border-none p-0 cursor-pointer">
            <i className={`bx mr-[5px] h-full ${showmemberPwd ? "bx-show" : "bx-hide"}`}></i>
          </button>
        </div>
        {errors.memberPwd && <div className="text-xs ml-1 text-red-500">{errors.memberPwd}</div>}

        {/* 비밀번호 확인 */}
        <label className="font-bold block mb-[10px] mt-5">비밀번호 확인*</label>
        <div className="relative">
          <input name="confirmPwd" type={showmemberPwd ? "text" : "password"} value={formData.confirmPwd} onChange={handleChange} required placeholder="비밀번호를 확인하세요" minLength="8" maxLength="30"
          className="w-full p-[10px] text-sm border border-gray-300 rounded-md">
          </input>
        </div>
        {confirmPwdError && (<div className="text-xs ml-1 text-red-500">{confirmPwdError}</div>)}

        {/* 이메일 */}
        <label className="font-bold block mt-5 mb-[10px]">이메일 *</label>
        <div className="flex gap-2">
          <input name="memberEmail" ref={emailInputRef} value={formData.memberEmail} onChange={handleChange} required placeholder="이메일을 입력하세요" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="올바른 이메일 주소를 입력하세요 (예: revory@gmail.com)" 
          readOnly={emailLocked} className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
          {!emailVerified && (
            <button 
              type="button" 
              onClick={handleEmailAuth}
              className={`w-[170px] h-[42px] px-4 text-sm border rounded-md whitespace-nowrap
                ${isSending ? 'bg-gray-300 cursor-not-allowed' : 'bg-white border-gray-800 hover:bg-gray-100'}`}
            >
              {isSending ? `${cooldown}초 후 전송 가능` : '인증번호 전송'}
            </button>
          )}
        </div>
        {errors.memberEmail && <div className="text-xs ml-1 text-red-500">{errors.memberEmail}</div>}
        {emailVerified && <div className="text-xs ml-1 text-blue-500">이메일 인증완료</div>}
        {/* 이메일 인증 폼 */}
        {emailAuthVisible && (
          <>
          <div className="flex items-center gap-2 mt-2">
            <input type="text" ref={authCodeRef} placeholder="이메일 인증번호 입력" className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
            {authExpireCountdown > 0 && (
              <p className="text-sm text-red-500 w-[48px] text-center">
                {Math.floor(authExpireCountdown / 60)}:
                {(authExpireCountdown % 60).toString().padStart(2, "0")}
              </p>
            )}
            <button type="button" onClick={confirmEmailAuth} className="w-[190px] h-[42px] px-4 text-sm border bg-blue-500 text-white rounded-md whitespace-nowrap hover:bg-blue-300">인증번호 확인</button>
          </div>
          {emailAuthMessage && (
            <p className="text-xs ml-1 text-red-500 ">
              {emailAuthMessage}
            </p>
          )}
          </>
        )} 

        {/* 이름 */}
        <label className="font-bold block mb-[5px] mt-5">이름 *</label>
        <div className="text-xs text-gray-500 mb-1 s mt-1">실명으로 등록하지 않을 경우 리뷰어 인증이 있을 수 있습니다</div>
        <input name="memberName" value={formData.memberName} onChange={handleChange} required className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />
        {errors.memberName && <div className="text-xs ml-1 text-red-500">{errors.memberName}</div>}

        {/* 닉네임 */}
        <label className="font-bold block mb-[10px] mt-5">닉네임 *</label>
        <input name="nickname" value={formData.nickname} onChange={handleChange} required className="w-full p-[10px] text-sm border border-gray-300 rounded-md" />

        {/* 휴대폰 번호 */}
        <label className="font-bold block mt-5 mb-[10px]">휴대폰 번호 *</label>
        <input name="memberPhone" value={formData.memberPhone} onChange={handleChange} placeholder="'-' 빼고 숫자만 입력해주세요." className="w-full p-[10px] text-sm border border-gray-300 rounded-md" maxLength={11}/>
        {errors.memberPhone && <div className="text-xs ml-1 text-red-500">{errors.memberPhone}</div>}

        {/* 생년월일 & 성별 */}
        <div className="flex gap-4 mt-6">
          <div className="w-1/2">
            <label className="font-semibold">생년월일</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="border px-3 py-2 rounded-md w-full mt-1" />
          </div>
          <div className="w-1/2">
            <label className="font-semibold">성별</label>
            <div className="flex gap-4 mt-1">
              {["M", "F"].map((gender) => (
                <label
                  key={gender}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all
                    ${formData.gender === gender ? "bg-blue-400 text-white " : "border-gray-300 text-gray-600"}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {gender === "M" ? "남" : "여"}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 리뷰어 유형 */}
        <div>
          <label className="font-semibold mt-6 block">리뷰어 유형 *</label>
          {errors.platform && <div className="text-xs text-red-500">{errors.platform}</div>}
          <div className="flex gap-4 mt-2 mb-6 overflow-x-auto pb-2">
            {platformList.map(({ code_id, code_nm, image_url }) => (
              <button
              key={code_id}
              type="button"
              onClick={() => togglePlatform(code_id)}
              className={`platform-btn flex flex-col justify-center items-center border rounded-full px-4 py-3 w-24 h-24 text-xs hover:shadow-md transition ${
                formData.platforms.includes(code_id) ? 'bg-blue-100 font-semibold' : ''
              }`}
              >
                <img src={image_url} alt={code_nm} className="w-8 h-8 mb-1" />
                {code_nm}
              </button>
            ))}
          </div>
        </div>

        {/* 해당 유형의 주소 */}
        {formData.platforms.map((code_id) => {
          const platform = platformList.find(p => p.code_id === code_id);
          return (
            <div key={code_id} className="mb-4">
              <label className="font-semibold">{platform?.code_nm} 주소</label>
              <input
                name={`link-${code_id}`}
                type="url"
                value={formData.links[code_id] || ""}
                onChange={handleChange}
                placeholder={`https://www.${platform?.code_nm.toLowerCase()}.com/...`}
                className="border px-3 py-2 rounded-md w-full mt-1"
              />
            </div>
          );
        })}

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
