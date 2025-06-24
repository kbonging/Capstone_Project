package com.webcore.platform.reviewer;

import com.webcore.platform.reviewer.dto.ReviewerDTO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviewer")
public class ReviewerController {
    private final ReviewerService reviewerService;

    /**
     * 회원가입
     * @param reviewerDTO 리뷰어 정보를 담은 DTO
     * @return 가입 처리 결과 상태 객체
     * @throws Exception 오류가 발생한 경우
     */
    @PostMapping("")
    public ResponseEntity<?> signupReviewer(@RequestBody ReviewerDTO reviewerDTO, HttpSession session) throws Exception{
        log.info("[POST] : /api/reviewer");
        log.info("리뷰어 회원가입 데이터 : {}",reviewerDTO.toString());

        // 세션에서 이메일 인증 관련 정보 조회
        String verifiedEmail = (String) session.getAttribute("VERIFIED_EMAIL");
        Long expires = (Long) session.getAttribute("VERIFICATION_EXPIRES");

        // 이메일 인증 유효성 검사:
        // 1) 세션에 인증된 이메일이 존재하는지
        // 2) 인증된 이메일이 요청한 회원가입 이메일과 일치하는지
        // 3) 인증 유효기간이 만료되지 않았는지
        boolean isValid = verifiedEmail != null && verifiedEmail.equals(reviewerDTO.getMemberEmail())
                && expires != null && System.currentTimeMillis() <= expires;

        if (!isValid) {
            // 인증 실패 시 회원가입 진행하지 않고 실패 응답 반환
            log.info("이메일 인증 검증 실패 - 회원가입 불가");
            return new ResponseEntity<>("EMAIL_VERIFICATION_FAILED", HttpStatus.BAD_REQUEST);
        }

        try{
            reviewerService.signupReviewer(reviewerDTO);
            log.info("회원가입 성공!!!! - SUCCESS");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            log.info("회원가입 실패.... - FAIL");
            log.error("에러 메시지: ", e); // 이 줄 추가!!!
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
