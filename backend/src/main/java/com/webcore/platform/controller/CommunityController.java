package com.webcore.platform.controller;

import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.service.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
        int result = communityService.createPost(communityDTO);

        if(result > 0){
            log.info("Community created successfully");
            return new ResponseEntity<>("게시글 작성이 완료되었습니다.", HttpStatus.OK);
        }else {
            log.info("Community creation failed");
            return new ResponseEntity<>("게시글 작성이 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{communityIdx}")
    public ResponseEntity<?> deletePost(@PathVariable int communityIdx,
                                        @AuthenticationPrincipal CustomUser customUser) throws Exception {
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();

        CommunityDTO dto = new CommunityDTO();
        dto.setCommunityIdx(communityIdx);
        dto.setMemberIdx(loginMemberIdx);

        int result = communityService.deletePost(dto);
        if(result > 0) {
            log.info("Community deleted successfully");
            return new ResponseEntity<>("게시글이 삭제되었습니다.", HttpStatus.OK);
        } else {
            log.info("Community deletion failed");
            return new ResponseEntity<>("삭제 권한이 없거나 게시글이 존재하지 않습니다.", HttpStatus.FORBIDDEN);
        }
    }
}
