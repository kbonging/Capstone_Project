package com.webcore.platform.controller;

import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.service.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [GET]        /api/community  - 게시글 조회
 * [POST]       /api/community  - 게시글 등록
 * [PUT]        /api/community  - 게시글 수정
 * [DELETE]     /api/community  - 게시글 삭제
 * */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService communityService;

    // 커뮤니티 글 작성 (로그인한 유저만 가능)
    @PostMapping("")
    public ResponseEntity<?> createPost(@RequestBody CommunityDTO communityDTO,
                                   @AuthenticationPrincipal CustomUser customUser) throws Exception {
        int memberIdx = customUser.getMemberDTO().getMemberIdx();
        communityDTO.setMemberIdx(memberIdx);
        int result = communityService.registCommunity(communityDTO);

        if(result > 0){
            log.info("Community created successfully");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else {
            log.info("Community creation failed");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
