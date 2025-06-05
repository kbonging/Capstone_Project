package com.webcore.platform.controller;

import com.webcore.platform.domain.CommentDTO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.response.CommentListResponseDTO;
import com.webcore.platform.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    /** 게시글 댓글 리스트 조회 */
    @GetMapping("/{type}/{idx}")
    public ResponseEntity<?> getCommentsByCommunity(@PathVariable int idx,
                                                    @PathVariable String type) {
        List<CommentListResponseDTO> commentListByCommunityIdx = commentService.selectCommentsByCommunityIdx(idx, type);
        return new ResponseEntity<>(commentListByCommunityIdx, HttpStatus.OK);
    }

    /**[댓글 등록 API] 최상위 + 대댓글 포함 [셀렉 조회할때 sortOrder 키워드 사용해서 자식댓글 순차적으로 조회]*/
    @PostMapping("")
    public ResponseEntity<?> addComment(
            @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        try {
//            log.info("[POST] : /api/"+communityIdx+"comments");
            commentDTO.setMemberIdx(customUser.getMemberDTO().getMemberIdx());
            commentService.insertComment(commentDTO);

            return ResponseEntity.ok("댓글 등록 성공");
        } catch (Exception e) {
            log.error("댓글 등록 실패", e);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("댓글 등록 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/{commentIdx}")
    public ResponseEntity<?> deleteComment(@PathVariable int commentIdx,
                                           @AuthenticationPrincipal CustomUser customUser) {
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();

        CommentDTO comment = commentService.getCommentById(commentIdx);
        if (comment == null) {
            return new ResponseEntity<>("댓글이 존재하지 않습니다.", HttpStatus.OK);
        }

        if (comment.getMemberIdx() != loginMemberIdx) {
            return new ResponseEntity<>("본인이 작성한 댓글만 삭제할 수 있습니다.", HttpStatus.OK);
        }

        CommentDTO dto = new CommentDTO();
        dto.setCommentIdx(commentIdx);
        dto.setMemberIdx(loginMemberIdx);

        int result = commentService.deleteComment(dto);
        if (result > 0) {
            log.info("Community deleted successfully");
            return new ResponseEntity<>("댓글이 삭제되었습니다.", HttpStatus.OK);
        } else {
            log.info("Community deletion failed");
            return new ResponseEntity<>("삭제 권한이 없거나 댓글이 존재하지 않습니다.", HttpStatus.OK);
        }
    }

    @PutMapping("/{commentIdx}")
    public ResponseEntity<?> updateComment(@PathVariable int commentIdx,
                              @RequestBody CommentDTO commentDTO,
                              @AuthenticationPrincipal CustomUser customUser) {

        commentDTO.setCommentIdx(commentIdx);
        commentDTO.setMemberIdx(customUser.getMemberDTO().getMemberIdx());
        return commentService.updateComment(commentDTO);
    }
}
