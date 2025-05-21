package com.webcore.platform.controller;

import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.domain.MemberDTO;
import com.webcore.platform.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


/**
 * [GET]        /members/info   - 회원정보 조회   (ROLE_USER)
 * [POST]       /members        - 회원가입         ALL
 * [PUT]        /members        - 회원정보 수정   (ROLE_USER)
 * [DELETE]     /members        - 회원탈퇴      (ROLE_ADMIN)
 * */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController { // 현재 이거 안씀
    private final MemberService memberService;

    /**
     * 사용자 정보 조회
     * @param customUser
     * @return
     */
    //@Secured("ROLE_USER")           // USER 권한 설정
    @GetMapping("/info")
    public ResponseEntity<?> userInfo(@AuthenticationPrincipal CustomUser customUser) {

        log.info("::::: customUser :::::");
        log.info("customUser : {}", customUser);

        MemberDTO memberDTO = customUser.getMemberDTO();
        log.info("memberDTO : {}", memberDTO);

        // 인증된 사용자 정보
        if(memberDTO != null)
            return new ResponseEntity<>(memberDTO, HttpStatus.OK);

        // 인증 되지 않음
        return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }

    /**
     * 회원가입
     * @param memberDTO
     * @return
     * @throws Exception
     */
    @PostMapping("")
    public ResponseEntity<?> join(@RequestBody MemberDTO memberDTO) throws Exception{
        log.info("[POST] : /members");
        int result = memberService.insertMember(memberDTO);

        if(result > 0){
            log.info("회원가입 성공! - SUCCESS");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            log.info("회원가입 실패! - FAIL");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
