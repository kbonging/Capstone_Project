import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUpOwner } from "../api/ownerApi";
import { checkDuplicateId, isEmailExists, sendVerificationCode, verifyAuthCode } from "../api/authApi";
import { validateInput, formatPhoneNumber } from "../utils/common";

export default function OwnerFormPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        memberId: "",
        memberPwd: "",
        memberName: "",
        memberEmail: "",
        memberPhone: "",
        businessName: "",
        businessUrl: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPwd, setConfirmPwd] = useState("");
    const [confirmPwdError, setConfirmPwdError] = useState("");

    const [terms1, setTerms1] = useState(false);
    const [terms2, setTerms2] = useState(false);
    const [terms3, setTerms3] = useState(false);

    const [idDuplicateMessage, setIdDuplicateMessage] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);

    const emailInputRef = useRef(null);
    const authCodeRef = useRef(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
    const [emailCooldown, setEmailCooldown] = useState(0);
    const [emailAuthMessage, setEmailAuthMessage] = useState(""); // 이메일 인증 관련 성공/실패 메시지용
    const [emailAuthVisible, setEmailAuthVisible] = useState(false);
    const [emailLocked, setEmailLocked] = useState(false);
    const [authCodeExpireCountdown, setAuthCodeExpireCountdown] = useState(0);
    const authCodeExpireTimerRef = useRef(null);
    const emailCooldownTimerRef = useRef(null);

    const validationPatterns = {
        memberId: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/,
        memberPwd: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,}$/,
        memberName: /^[가-힣a-zA-Z]{2,10}$/,
        memberEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        memberPhone: /^01(?:0|1|[6-9])\d{7,8}$/,
        businessName: /.{1,50}/,
        businessUrl: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$|^$/,
    };

    useEffect(() => {
        if (emailCooldown > 0) {
            emailCooldownTimerRef.current = setInterval(() => {
                setEmailCooldown((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(emailCooldownTimerRef.current);
        }
        return () => clearInterval(emailCooldownTimerRef.current);
    }, [emailCooldown]);

    useEffect(() => {
        if (authCodeExpireCountdown > 0) {
            authCodeExpireTimerRef.current = setInterval(() => {
                setAuthCodeExpireCountdown((prev) => prev - 1);
            }, 1000);
        } else if (authCodeExpireCountdown === 0 && (emailAuthVisible || emailVerified)) {
            // 이메일 인증이 만료되었을 때
            setEmailAuthMessage("인증번호가 만료되었습니다. 다시 시도해주세요.");
            setEmailLocked(false);
            setEmailVerified(false); // 인증 상태를 false로 변경
            setEmailAuthVisible(false); // 인증번호 입력 필드 숨김
            setErrors((prev) => ({ ...prev, memberEmail: '인증번호가 만료되었습니다. 다시 인증해주세요.' }));
            clearInterval(authCodeExpireTimerRef.current); // 타이머 종료
        }
        return () => clearInterval(authCodeExpireTimerRef.current);
    }, [authCodeExpireCountdown, emailAuthVisible, emailVerified]);


    const runFieldValidation = (name, value) => {
        let error = "";
        const pattern = validationPatterns[name];

        if (name === "businessUrl" && !value.trim()) {
            error = "";
        } else if (pattern && !validateInput(value, pattern)) {
            switch (name) {
                case "memberId":
                    error = "아이디는 영문, 숫자 조합 8~15자리여야 합니다.";
                    break;
                case "memberPwd":
                    error = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
                    break;
                case "memberName":
                    error = "이름은 한글 또는 영문 2~10자로 입력해주세요.";
                    break;
                case "memberEmail":
                    error = "유효한 이메일 주소를 입력해주세요.";
                    break;
                case "memberPhone":
                    error = "유효한 휴대폰 번호를 입력해주세요. (10~11자리 숫자)";
                    break;
                case "businessName":
                    error = "상호명은 1자 이상 50자 이하로 입력해주세요.";
                    break;
                case "businessUrl":
                    error = "유효한 홈페이지 URL을 입력해주세요.";
                    break;
                default:
                    error = "유효하지 않은 입력입니다.";
            }
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === "";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (name === "memberPhone") {
            newValue = newValue.replace(/[^0-9]/g, '');
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (name === "memberId") {
            setIsIdChecked(false);
            setIdDuplicateMessage("");
            setErrors((prev) => ({ ...prev, memberId: "" }));
        }
        if (name === "memberEmail") {
            setEmailVerified(false);
            setEmailAuthVisible(false); // 이메일 변경 시 인증 필드 숨김
            setEmailLocked(false);
            setEmailAuthMessage(""); // 이메일 필드 변경 시 인증 관련 메시지 초기화
            clearInterval(authCodeExpireTimerRef.current);
            setAuthCodeExpireCountdown(0);
            setEmailCooldown(0);
            clearInterval(emailCooldownTimerRef.current);
            setErrors((prev) => ({ ...prev, memberEmail: "" })); // 이메일 필드에 대한 에러 메시지 제거
        }

        if (name === "memberPwd" || name === "confirmPwd") {
            const currentMemberPwd = name === "memberPwd" ? newValue : formData.memberPwd;
            const currentConfirmPwd = name === "confirmPwd" ? newValue : confirmPwd;

            if (currentConfirmPwd && currentMemberPwd !== currentConfirmPwd) {
                setConfirmPwdError("비밀번호가 일치하지 않습니다.");
            } else {
                setConfirmPwdError("");
            }
            if (name === "confirmPwd") {
                setConfirmPwd(newValue);
            }
        }

        if (name !== "memberId" && name !== "memberEmail" && name !== "memberPhone" && newValue.trim() !== "") {
            runFieldValidation(name, newValue);
        } else if (name !== "memberId" && name !== "memberEmail" && name !== "memberPhone") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCheckDuplicateId = async () => {
        const memberId = formData.memberId.trim();
        setIdDuplicateMessage("");
        setIsIdChecked(false);

        if (!memberId) {
            setIdDuplicateMessage("아이디를 입력해주세요.");
            setErrors((prev) => ({ ...prev, memberId: "아이디를 입력해주세요." }));
            return;
        }

        const isIdFormatValid = runFieldValidation("memberId", memberId);
        if (!isIdFormatValid) {
            setIdDuplicateMessage("아이디는 영문, 숫자 조합 8~15자리여야 합니다.");
            return;
        }

        try {
            const response = await checkDuplicateId(memberId);
            const isDuplicate = response.data;

            if (isDuplicate) {
                setIdDuplicateMessage("이미 사용 중인 아이디입니다.");
                setErrors((prev) => ({ ...prev, memberId: "이미 사용 중인 아이디입니다." }));
            } else {
                setIdDuplicateMessage("사용 가능한 아이디입니다.");
                setErrors((prev) => ({ ...prev, memberId: "" }));
                setIsIdChecked(true);
            }
        } catch (error) {
            console.error("ID 중복 확인 API 호출 실패:", error);
            setIdDuplicateMessage("ID 중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setErrors((prev) => ({ ...prev, memberId: "ID 중복 확인 중 오류가 발생했습니다." }));
        }
    };

    // 이메일 인증번호 전송
    const handleSendVerificationCode = async () => {
        const memberEmail = formData.memberEmail.trim();

        if (!memberEmail) {
            setErrors((prev) => ({ ...prev, memberEmail: "이메일을 입력하세요." }));
            setEmailAuthMessage("");
            return;
        }

        const isEmailFormatValid = runFieldValidation("memberEmail", memberEmail);
        if (!isEmailFormatValid) {
            setEmailAuthMessage("");
            return;
        }

        setErrors((prev) => ({ ...prev, memberEmail: "" }));
        setEmailAuthMessage(""); // 기존 메시지 초기화 (성공/실패 관련)

        setIsSendingEmailCode(true);

        try {
            const emailExistsResponse = await isEmailExists(memberEmail);
            const exists = emailExistsResponse.data;

            if (exists) {
                setErrors((prev) => ({ ...prev, memberEmail: "이미 가입된 이메일입니다." }));
                setEmailAuthMessage("");
                setIsSendingEmailCode(false);
                return;
            }

            // 이메일 중복이 아닐 경우에만 인증 코드 관련 로직 실행
            clearTimeout(authCodeExpireTimerRef.current);
            setAuthCodeExpireCountdown(300); // 5분 = 300초

            clearInterval(emailCooldownTimerRef.current);
            setEmailCooldown(10);
            emailCooldownTimerRef.current = setInterval(() => {
                setEmailCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(emailCooldownTimerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            await sendVerificationCode({ memberEmail });
            setEmailAuthVisible(true); // 인증번호 입력 필드 보이기
            setEmailLocked(true);
            setEmailVerified(false); // 인증번호 재전송 시 인증 상태 초기화
            setEmailAuthMessage("인증번호가 발송되었습니다. 이메일을 확인해주세요.");
            alert("인증번호가 발송되었습니다. 이메일을 확인해주세요.");
        } catch (error) {
            console.error("인증번호 발송 실패:", error);
            setEmailAuthMessage("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
            setErrors((prev) => ({ ...prev, memberEmail: "인증번호 발송 실패" }));
            setEmailAuthVisible(false); // 실패 시 입력 필드 숨김
            setEmailLocked(false);
            setAuthCodeExpireCountdown(0);
            setEmailCooldown(0);
            clearInterval(authCodeExpireTimerRef.current);
            clearInterval(emailCooldownTimerRef.current);
        } finally {
            setIsSendingEmailCode(false);
        }
    };

    const handleVerifyCode = async () => {
        const authCode = authCodeRef.current.value.trim();
        if (!authCode) {
            setEmailAuthMessage("인증번호를 입력해주세요.");
            return;
        }

        try {
            await verifyAuthCode({ memberEmail: formData.memberEmail, authCode });
            setEmailVerified(true);
            setEmailAuthMessage("이메일 인증이 완료되었습니다. 5분 후에 인증이 만료됩니다.");
            setEmailAuthVisible(false); // 인증 성공 후에는 인증번호 입력 필드 숨김
            setErrors((prev) => ({ ...prev, memberEmail: "" }));
            alert("이메일 인증이 완료되었습니다!");
        } catch (error) {
            console.error("인증 실패:", error);
            setEmailAuthMessage("잘못된 인증번호이거나 만료되었습니다. 다시 시도해주세요.");
            setEmailVerified(false);
            setErrors((prev) => ({ ...prev, memberEmail: "이메일 인증 실패" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let allFieldsValid = true;

        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            if (name === "businessUrl" && !value.trim()) {
                return;
            }
            if (!value.trim()) {
                const fieldNameKor = {
                    memberId: "아이디",
                    memberPwd: "비밀번호",
                    memberName: "이름",
                    memberEmail: "이메일",
                    memberPhone: "휴대폰 번호",
                    businessName: "상호명",
                    businessUrl: "홈페이지 주소"
                }[name] || "이 필드";
                newErrors[name] = `${fieldNameKor}를 입력해주세요.`;
                allFieldsValid = false;
            } else if (name === "memberId") {
                if (!runFieldValidation(name, value)) {
                    allFieldsValid = false;
                    newErrors[name] = errors.memberId || "아이디 형식이 올바르지 않습니다.";
                }
            } else if (name === "memberEmail") {
                if (!runFieldValidation(name, value)) {
                    allFieldsValid = false;
                    newErrors[name] = errors.memberEmail || "이메일 형식이 올바르지 않습니다.";
                }
            } else if (name === "memberPhone") {
                if (!runFieldValidation(name, value)) {
                    allFieldsValid = false;
                    newErrors[name] = errors.memberPhone || "유효한 휴대폰 번호 (예: 01012345678)를 입력해주세요.";
                }
            }
            else if (!runFieldValidation(name, value)) {
                allFieldsValid = false;
            }
        });

        if (!confirmPwd.trim()) {
            newErrors.confirmPwd = "비밀번호 확인을 입력하세요.";
            allFieldsValid = false;
        } else if (formData.memberPwd !== confirmPwd) {
            newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
            allFieldsValid = false;
        }

        if (!isIdChecked || idDuplicateMessage !== "사용 가능한 아이디입니다.") {
            newErrors.memberId = idDuplicateMessage || "아이디 중복 확인을 해주세요.";
            allFieldsValid = false;
        }

        // 이메일 인증이 완료되지 않았거나, 완료되었더라도 타이머가 만료되었으면 유효성 검사 실패
        if (!emailVerified || authCodeExpireCountdown === 0) {
            newErrors.memberEmail = newErrors.memberEmail || "이메일 인증을 완료해주세요.";
            allFieldsValid = false;
        }

        if (!terms1 || !terms2) {
            newErrors.terms = "필수 약관에 동의해주세요.";
            allFieldsValid = false;
        }

        setErrors(newErrors);
        return allFieldsValid && Object.keys(newErrors).length === 0;
    };


    const createSubmitPayload = (data) => {
        return {
            memberId: data.memberId,
            memberPwd: data.memberPwd,
            memberName: data.memberName,
            memberEmail: data.memberEmail,
            memberPhone: data.memberPhone,
            businessName: data.businessName,
            businessUrl: data.businessUrl,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("필수 항목을 모두 입력하고 올바르게 수정해주세요.");
            return;
        }

        if (!isIdChecked || idDuplicateMessage !== "사용 가능한 아이디입니다.") {
            alert("아이디 중복 확인을 완료해주세요.");
            return;
        }
        if (!emailVerified || authCodeExpireCountdown === 0) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }
        if (formData.memberPwd !== confirmPwd) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        const formattedPhoneNumber = formatPhoneNumber(formData.memberPhone);

        const requestbody = {
            memberId: formData.memberId,
            memberPwd: formData.memberPwd,
            memberName: formData.memberName,
            memberEmail: formData.memberEmail,
            memberPhone: formattedPhoneNumber,
            businessName: formData.businessName,
            businessUrl: formData.businessUrl,
            marketingOptIn: terms3,
        };

        console.log("전송 requestbody:", requestbody);

        try {
            await signUpOwner(requestbody);
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (error) {
            alert(
                "회원가입 중 오류가 발생했습니다: " +
                (error.response?.data?.message || error.message)
            );
            console.error("회원가입 실패:", error);
        }
    };

    const isSignUpButtonEnabled =
        formData.memberId.trim() !== "" &&
        isIdChecked &&
        !errors.memberId &&
        formData.memberPwd.trim() !== "" &&
        confirmPwd.trim() !== "" &&
        formData.memberPwd === confirmPwd &&
        formData.memberName.trim() !== "" &&
        formData.memberEmail.trim() !== "" &&
        emailVerified &&
        authCodeExpireCountdown > 0 && // 인증번호 타이머가 유효할 때만 활성화
        formData.memberPhone.trim() !== "" &&
        formData.businessName.trim() !== "" &&
        terms1 &&
        terms2 &&
        Object.values(errors).every((error) => !error) &&
        Object.values(formData).every(value => {
            if (value === formData.businessUrl) {
                return true;
            }
            return value.trim() !== '';
        });


    return (
        <main className="max-w-[500px] mx-auto mt-[60px] font-['Noto_Sans_KR']">
            <h2 className="text-[24px] font-bold mb-[30px] border-b border-gray-300 pb-[10px]">
                회원가입
            </h2>
            <form onSubmit={handleSubmit}>
                {/* 아이디 */}
                <label className="font-bold block mb-[10px]">아이디 *</label>
                <div className="flex gap-2">
                    <input
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleChange}
                        required
                        placeholder="아이디를 입력하세요 (영문 소문자, 숫자 조합 8~15자)"
                        className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                        minLength="8"
                        maxLength="15"
                    />
                    <button
                        type="button"
                        onClick={handleCheckDuplicateId}
                        className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100"
                    >
                        중복확인
                    </button>
                </div>
                {idDuplicateMessage && (
                    <div
                        className={`text-xs mt-1 ${isIdChecked ? "text-blue-500" : "text-red-500"
                            }`}
                    >
                        {idDuplicateMessage}
                    </div>
                )}

                {/* 비밀번호 */}
                <label className="font-bold block mb-[10px] mt-5">비밀번호 *</label>
                <div className="relative">
                    <input
                        name="memberPwd"
                        type={showPassword ? "text" : "password"}
                        value={formData.memberPwd}
                        onChange={handleChange}
                        required
                        placeholder="비밀번호를 입력하세요 (영문, 숫자, 특수문자 포함 8자 이상)"
                        minLength="8"
                        maxLength="30"
                        className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-none border-none p-0 cursor-pointer"
                    >
                        <i
                            className={`bx mr-[5px] h-full ${showPassword ? "bx-show" : "bx-hide"
                                }`}
                        ></i>
                    </button>
                </div>
                {errors.memberPwd && (
                    <div className="text-xs text-red-500">{errors.memberPwd}</div>
                )}

                {/* 비밀번호 확인 */}
                <label className="font-bold block mb-[10px] mt-5">
                    비밀번호 확인 *
                </label>
                <div className="relative">
                    <input
                        name="confirmPwd"
                        type={showPassword ? "text" : "password"}
                        value={confirmPwd}
                        onChange={handleChange}
                        required
                        placeholder="비밀번호를 다시 입력하세요"
                        minLength="8"
                        maxLength="30"
                        className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                    />
                </div>
                {confirmPwdError && (
                    <div className="text-xs text-red-500">{confirmPwdError}</div>
                )}
                {errors.confirmPwd && confirmPwdError !== errors.confirmPwd && (
                    <div className="text-xs text-red-500">{errors.confirmPwd}</div>
                )}

                {/* 이메일 */}
                <label className="font-bold block mt-5 mb-[10px]">이메일 *</label>
                <div className="flex gap-2">
                    <input
                        name="memberEmail"
                        ref={emailInputRef}
                        value={formData.memberEmail}
                        onChange={handleChange}
                        required
                        placeholder="이메일을 입력하세요 (예: user@example.com)"
                        readOnly={emailLocked}
                        className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100"
                        disabled={isSendingEmailCode || emailCooldown > 0}
                    >
                        {isSendingEmailCode
                            ? "전송 중..."
                            : emailCooldown > 0
                                ? `${emailCooldown}초 후 재전송`
                                : "인증번호 전송"}
                    </button>
                </div>
                {errors.memberEmail && (
                    <div className="text-xs text-red-500">{errors.memberEmail}</div>
                )}
                {emailAuthMessage && !errors.memberEmail && (
                    <div
                        className={`text-xs mt-1 ${emailVerified ? "text-blue-500" : "text-red-500"
                            }`}
                    >
                        {emailAuthMessage}
                    </div>
                )}

                {/* emailAuthVisible 상태로 인증번호 입력 필드 표시 여부 제어 */}
                {emailAuthVisible && (
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            ref={authCodeRef}
                            placeholder="이메일 인증번호 입력"
                            className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            className="h-[42px] px-4 text-sm border border-gray-800 bg-white rounded-md whitespace-nowrap hover:bg-gray-100"
                        >
                            인증 확인
                        </button>
                    </div>
                )}
                {authCodeExpireCountdown > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                        인증번호 만료까지:{" "}
                        {Math.floor(authCodeExpireCountdown / 60)}분{" "}
                        {authCodeExpireCountdown % 60}초
                    </div>
                )}

                {/* 이름 */}
                <label className="font-bold block mb-[5px] mt-5">이름 *</label>
                <div className="text-xs text-gray-500 mb-1 s mt-1">
                    실명으로 등록하지 않을 경우 소상공인 인증이 어려울 수 있습니다.
                </div>
                <input
                    name="memberName"
                    value={formData.memberName}
                    onChange={handleChange}
                    required
                    placeholder="이름을 입력하세요 (한글/영문 2~10자)"
                    className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                />
                {errors.memberName && (
                    <div className="text-xs text-red-500">{errors.memberName}</div>
                )}

                {/* 휴대폰 번호 */}
                <label className="font-bold block mt-5 mb-[10px]">
                    휴대폰 번호 *
                </label>
                <input
                    name="memberPhone"
                    value={formData.memberPhone}
                    onChange={handleChange}
                    placeholder="'-' 빼고 숫자만 입력해주세요."
                    className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                    maxLength="11"
                />
                {errors.memberPhone && (
                    <div className="text-xs text-red-500">{errors.memberPhone}</div>
                )}

                {/* 상호명 */}
                <label className="font-bold block mb-[10px] mt-5">상호명 *</label>
                <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="상호명을 입력하세요 (1~50자)"
                    className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                />
                {errors.businessName && (
                    <div className="text-xs text-red-500">{errors.businessName}</div>
                )}

                {/* 홈페이지 url 주소 */}
                <label className="font-bold block mb-[10px] mt-5">
                    홈페이지 주소 URL
                </label>
                <input
                    name="businessUrl"
                    value={formData.businessUrl}
                    onChange={handleChange}
                    placeholder="예: https://www.yourbusiness.com (선택 사항)"
                    className="w-full p-[10px] text-sm border border-gray-300 rounded-md"
                />
                {errors.businessUrl && (
                    <div className="text-xs text-red-500">{errors.businessUrl}</div>
                )}

                <div className="mt-6">
                    <label className="flex items-center gap-2 text-sm mb-2">
                        <input
                            type="checkbox"
                            name="terms1"
                            checked={terms1}
                            onChange={(e) => setTerms1(e.target.checked)}
                        />
                        이용약관에 동의합니다 (필수)
                        <a href="#" className="ml-auto text-blue-500 text-xs">
                            보기
                        </a>
                    </label>

                    <label className="flex items-center gap-2 text-sm mb-2">
                        <input
                            type="checkbox"
                            name="terms2"
                            checked={terms2}
                            onChange={(e) => setTerms2(e.target.checked)}
                        />
                        개인정보 처리방침에 동의합니다 (필수)
                        <a href="#" className="ml-auto text-blue-500 text-xs">
                            보기
                        </a>
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="terms3"
                            checked={terms3}
                            onChange={(e) => setTerms3(e.target.checked)}
                        />
                        마케팅 정보 수신에 동의합니다 (선택)
                        <a href="#" className="ml-auto text-blue-500 text-xs">
                            보기
                        </a>
                    </label>

                    {errors.terms && (
                        <div className="text-xs text-red-500 mt-1">{errors.terms}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full h-[42px] mt-[30px] mb-10 bg-blue-500 rounded-lg text-white font-bold text-[16px] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!isSignUpButtonEnabled}
                >
                    회원가입
                </button>
            </form>
        </main>
    );
}