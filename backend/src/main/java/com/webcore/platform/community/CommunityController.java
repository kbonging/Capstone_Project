package com.webcore.platform.community;

import com.webcore.platform.community.dto.CommunityDTO;
import com.webcore.platform.security.custom.CustomUser;
import com.webcore.platform.community.dto.CommunityDetailResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<?> getCommunityList(CommunityDTO communityDTO){
        log.info("[GET] /api/community [Request] => {}",communityDTO.toString());
        Map<String, Object> resultMap = communityService.getCommunityListResult(communityDTO);
        log.info("게시글 조회 정보 => {}", resultMap);
        
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    /** 커뮤니티 상세페이지 조회*/
    @GetMapping("/{communityIdx}")
    public ResponseEntity<?> getCommunityDetail(@PathVariable int communityIdx,
                                                @AuthenticationPrincipal CustomUser customUser) {
        log.info("[GET] /api/community/{{{}}}", communityIdx);

        CommunityDetailResponseDTO communityDetail = communityService.getCommunityByIdx(communityIdx, customUser.getMemberDTO().getMemberIdx());
        log.info("게시글 상세 페이지 => {}", communityDetail);
        return new ResponseEntity<>(communityDetail, HttpStatus.OK);
    }

    /** 좋아요 등록 */
    @PostMapping("/like/{communityIdx}")
    public ResponseEntity<?> addLike(@PathVariable int communityIdx,
                                     @AuthenticationPrincipal CustomUser customUser){
        boolean success = communityService.addLike(communityIdx, customUser.getMemberDTO().getMemberIdx());
        if (success){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** 좋아요 삭제 */
    @DeleteMapping("/like/{communityIdx}")
    public ResponseEntity<?> deleteLike(@PathVariable int communityIdx,
                                     @AuthenticationPrincipal CustomUser customUser){
        boolean success = communityService.removeLike(communityIdx, customUser.getMemberDTO().getMemberIdx());
        if (success){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** 커뮤니티 게시글 등록 */ 
    @PostMapping("")
    public ResponseEntity<?> createPost(@RequestBody CommunityDTO communityDTO,
                                   @AuthenticationPrincipal CustomUser customUser) {
        communityDTO.setMemberIdx(customUser.getMemberDTO().getMemberIdx());
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

        CommunityDetailResponseDTO post = communityService.getCommunityByIdx(communityIdx, customUser.getMemberDTO().getMemberIdx());
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

        CommunityDetailResponseDTO originalPost = communityService.getCommunityByIdx(communityIdx, customUser.getMemberDTO().getMemberIdx());

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
