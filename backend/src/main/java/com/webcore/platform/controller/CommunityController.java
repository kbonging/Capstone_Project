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

import java.util.List;

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

    /** 커뮤니티 리스트 목록*/
    @GetMapping("")
    public ResponseEntity<?> getCommunityList(CommunityDTO communityDTO,
                                              @AuthenticationPrincipal CustomUser customUser){
        log.info("/api/community [Request] => {}",communityDTO.toString());
        List<CommunityDTO> communityList = communityService.selectCommunityList(communityDTO);
        log.info("게시글 전체 목록 => {}", communityList);

        if(communityList==null || communityList.isEmpty()){
            return new ResponseEntity<>("조회된 게시글이 없습니다", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(communityList, HttpStatus.OK);
    }

    // 커뮤니티 글 작성 (로그인한 유저만 가능)
    @PostMapping("")
    public ResponseEntity<?> createPost(@RequestBody CommunityDTO communityDTO,
                                   @AuthenticationPrincipal CustomUser customUser) {
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

    // 커뮤니티 글 삭제 (작성자만 가능)
    @DeleteMapping("/{communityIdx}")
    public ResponseEntity<?> deletePost(@PathVariable int communityIdx,
                                        @AuthenticationPrincipal CustomUser customUser) {
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();

        CommunityDTO post = communityService.getCommunityByIdx(communityIdx);
        if (post == null) {
            return new ResponseEntity<>("게시글이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }

        if (post.getMemberIdx() != loginMemberIdx) {
            return new ResponseEntity<>("본인이 작성한 글만 삭제할 수 있습니다.", HttpStatus.FORBIDDEN);
        }

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

    // 커뮤니티 글 수정 (작성자만 가능)
    @PutMapping("/{communityIdx}")
    public ResponseEntity<?> updatePost(@PathVariable int communityIdx,
                                        @RequestBody CommunityDTO communityDTO,
                                        @AuthenticationPrincipal CustomUser customUser) {
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();

        CommunityDTO originalPost = communityService.getCommunityByIdx(communityIdx);

        if(originalPost == null){
            return new ResponseEntity<>("게시글이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }

        if(originalPost.getMemberIdx() != loginMemberIdx) {
            return new ResponseEntity<>("작성자 본인 아님", HttpStatus.FORBIDDEN);
        }

        communityDTO.setCommunityIdx(communityIdx);
        communityDTO.setMemberIdx(loginMemberIdx);

        int result = communityService.updatePost(communityDTO);
        if(result > 0) {
            log.info("Community updated successfully");
            return new ResponseEntity<>("게시글이 수정되었습니다.", HttpStatus.OK);
        } else {
            log.info("Community update failed");
            return new ResponseEntity<>("게시글 수정에 실패했습니다.", HttpStatus.FORBIDDEN);
        }
    }

}
