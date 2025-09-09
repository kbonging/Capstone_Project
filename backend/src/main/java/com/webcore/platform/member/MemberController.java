package com.webcore.platform.member;

import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.member.dto.MemberDTO;
import com.webcore.platform.owner.OwnerService;
import com.webcore.platform.reviewer.ReviewerService;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * [GET]        /members/info   - 회원정보 조회   (ROLE_USER)
 * [POST]       /members        - 회원가입         ALL
 * [PUT]        /members        - 회원정보 수정   (ROLE_USER)
 * [DELETE]     /members        - 회원탈퇴      (ROLE_ADMIN)
 * */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;
    private final ReviewerService reviewerService;
    private final OwnerService ownerService;

    /**
     * 사용자 정보 조회
     * @param customUser
     * @return
     */
    //@Secured("ROLE_USER")           // USER 권한 설정
    @GetMapping("/info")
    public ResponseEntity<?> userInfo(@AuthenticationPrincipal CustomUser customUser) {

        log.info("/api/members/info => ::::: customUser :::::");
        log.info("customUser : {}", customUser);

        MemberDTO memberDTO = customUser.getMemberDTO();
        List<MemberAuthDTO> authDTOList = memberDTO.getAuthDTOList();

        Object userInfo = memberService.loadUserInfoByMemberIdx(memberDTO.getMemberIdx(), authDTOList);

        if(userInfo!=null){
            return ResponseEntity.ok(userInfo);
        }

        // 인증 되지 않음
        return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    /** MemberIdx로 회원 정보 조회 */
    @GetMapping("/{memberIdx}")
    public ResponseEntity<?> getUserInfoByIdx(@PathVariable int memberIdx) {
        // memberIdx로 권한 가져오기
        List<MemberAuthDTO> authList = memberService.getAuthListByMemberIdx(memberIdx);

        // 권한이 없나?
        if (authList == null || authList.isEmpty()) {
            return new ResponseEntity<>("NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        Object userInfo = memberService.loadUserInfoByMemberIdx(memberIdx, authList);

        if (userInfo != null) {
            return ResponseEntity.ok(userInfo);
        }

        return new ResponseEntity<>("NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    /** 아이디 중복 채크 */
    @GetMapping("/check-id/{memberId}")
    public ResponseEntity<?> checkDuplicateId(@PathVariable String memberId){
        boolean isDuplicate = memberService.checkDuplicateId(memberId);
        return ResponseEntity.ok(isDuplicate);
    }

}
