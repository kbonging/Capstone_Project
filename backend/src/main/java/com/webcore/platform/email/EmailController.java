package com.webcore.platform.email;

import com.webcore.platform.member.MemberService;
import com.webcore.platform.member.dto.MemberDTO;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/emails")
public class EmailController {
    private final MemberService memberService;
    private final EmailService emailService;

    /** 이메일 중복 체크 */
    @GetMapping("/exists/{memberEmail}")
    public ResponseEntity<?> isEmailExists(@PathVariable String memberEmail){
        boolean exists = memberService.isEmailExists(memberEmail);
        return ResponseEntity.ok(exists);
    }

    /**
     * 이메일 인증코드 전송 API
     * - 사용자가 입력한 이메일로 인증코드를 생성하여 메일 전송
     * - 인증코드, 발급 대상 이메일, 발급 시각을 세션에 저장
     *
     * @param memberDTO 클라이언트에서 전달된 이메일 정보
     * @param session   인증정보 저장용 HttpSession
     * @return 전송 성공 여부 및 메시지 응답
     */
    @PostMapping("/verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody MemberDTO memberDTO, HttpSession session){
        Map<String, Object> response = new HashMap<>();
        String email = memberDTO.getMemberEmail();

        try {
            // 1. 인증번호 생성 및 메일 발송
            String code = emailService.sendVerificationCode(email);

            // 2. 세션에 인증 관련 정보 저장
            session.setAttribute("EMAIL_VERIFICATION_CODE", code); // 인증코드
            session.setAttribute("EMAIL_VERIFICATION_TIME", System.currentTimeMillis()); // 발급 시각
            session.setAttribute("EMAIL_VERIFICATION_TARGET", email); // 발급 대상 이메일

            response.put("success", true);
            response.put("message", "인증 메일이 전송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (MessagingException | UnsupportedEncodingException e) {
            response.put("success", false);
            response.put("message", "이메일 전송 중 오류가 발생했습니다.");
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 이메일 인증번호 검증 API
     * - 클라이언트가 입력한 인증번호와 세션에 저장된 정보를 비교하여 유효성 판단
     * - 인증번호가 일치하고 유효시간(예: 5분) 이내일 경우 성공 처리
     *
     * @param reqMap     이메일 및 인증번호 정보
     * @param session 세션에서 인증 관련 정보 조회
     * @return 인증 성공 여부 및 메시지
     */
    @PostMapping("/verification-code/validate")
    public ResponseEntity<?> verifyEmailCode(@RequestBody Map<String, String> reqMap, HttpSession session){
        Map<String, Object> response = new HashMap<>();

        // 클라이언트에서 전달받은 이메일과 인증번호 추출
        String email = reqMap.get("memberEmail");
        String authCode = reqMap.get("authCode");

        // 세션에서 저장된 인증 코드, 이메일, 발급 시각 조회
        String storedCode = (String) session.getAttribute("EMAIL_VERIFICATION_CODE");
        String storedEmail = (String) session.getAttribute("EMAIL_VERIFICATION_TARGET");
        Long storedTime = (Long) session.getAttribute("EMAIL_VERIFICATION_TIME");

        // 세션 만료 또는 비정상 접근
        if (storedCode == null || storedEmail == null || storedTime == null) {
            response.put("success", false);
            response.put("message", "인증 정보가 유효하지 않습니다. 다시 시도해주세요.");
            return ResponseEntity.ok(response);
        }

        // 이메일 일치 여부 확인
        if (!storedEmail.equals(email)) {
            response.put("success", false);
            response.put("message", "이메일 정보가 일치하지 않습니다.");
            return ResponseEntity.ok(response);
        }

        // 유효시간(예: 5분) 검사
        long currentTime = System.currentTimeMillis();
        if (currentTime - storedTime > 5 * 60 * 1000) { // 5분
            response.put("success", false);
            response.put("message", "인증 시간이 만료되었습니다. 다시 요청해주세요.");
            return ResponseEntity.ok(response);
        }

        // 인증번호 일치 여부 확인
        if (!storedCode.equals(authCode)) {
            response.put("success", false);
            response.put("message", "인증번호가 올바르지 않습니다.");
            return ResponseEntity.ok(response);
        }

        // 검증 성공
        response.put("success", true);
        response.put("message", "이메일 인증이 완료되었습니다.");

        // 인증 완료 후 세션에서 인증 관련 정보 삭제 (재사용 방지)
        session.removeAttribute("EMAIL_VERIFICATION_TARGET");
        session.removeAttribute("EMAIL_VERIFICATION_CODE");
        session.removeAttribute("EMAIL_VERIFICATION_TIME");

        // 인증 완료된 이메일과 유효 기간(예: 5분)을 세션에 별도로 저장하여
        // 회원가입 등 이후 로직에서 인증 상태를 검증할 수 있도록 함
        session.setAttribute("VERIFIED_EMAIL", email);
        session.setAttribute("VERIFICATION_EXPIRES", System.currentTimeMillis() + 5 * 60 * 1000); // 예: 5분

        return ResponseEntity.ok(response);
    }
}
