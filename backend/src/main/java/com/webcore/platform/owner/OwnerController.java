package com.webcore.platform.owner;

import com.webcore.platform.owner.dto.OwnerDTO;
import com.webcore.platform.owner.dto.OwnerReviewCheckListDTO;
import com.webcore.platform.security.custom.CustomUser;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner")
public class OwnerController {

    private final OwnerService ownerService;

    /**
     * 회원가입
     * @param ownerDTO 소상공인 정보를 담은 DTO
     * @return 가입 처리 결과 상태 객체
     * @throws Exception 오류가 발생한 경우
     */
    @PostMapping("")
    public ResponseEntity<?> signupOwner(@RequestBody OwnerDTO ownerDTO, HttpSession session) throws Exception{
        log.info("[POST] : /api/owner");
        log.info("소상공인 회원가입 데이터 : {}", ownerDTO.toString());

        String verifiedEmail = (String) session.getAttribute("VERIFIED_EMAIL");
        Long expires = (Long) session.getAttribute("VERIFICATION_EXPIRES");

        boolean isValid = verifiedEmail != null && verifiedEmail.equals(ownerDTO.getMemberEmail())
                && expires != null && System.currentTimeMillis() <= expires;

        if (!isValid) {
            log.info("이메일 인증 검증 실패 - 회원가입 불가");
            return new ResponseEntity<>("EMAIL_VERIFICATION_FAILED", HttpStatus.BAD_REQUEST);
        }

        try {
            ownerService.signupOwner(ownerDTO);
            log.info("회원가입 성공!!!! - SUCCESS");
            return new ResponseEntity<>("success", HttpStatus.OK);
        }catch (Exception e){
            log.info("회원가입 실패..");
            return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
    }

    // 소상공인(주최자) 캠페인 리뷰 제출 목록
    @GetMapping("/campaigns/{campaignId}/reviews")
    public Map<String, Object> getOwnerReviewList(
        @PathVariable Long campaignId,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String channel,     // CAMC001...
        @RequestParam(defaultValue = "desc") String sort,   // asc | desc
        @AuthenticationPrincipal CustomUser user
    ) {
        Integer ownerId = user.getMemberDTO().getMemberIdx(); // int면 오토박싱
        OwnerReviewCheckListDTO cond = new OwnerReviewCheckListDTO();
        cond.setPage(page);
        cond.setRecordCount(size);
        cond.setChannelCode(channel);
        // 정렬은 cond에 전용 필드를 만들거나, 여기선 searchCondition을 임시 활용
        cond.setSearchCondition(sort);

        return ownerService.getOwnerReviewList(campaignId, ownerId, cond);
    }
}
