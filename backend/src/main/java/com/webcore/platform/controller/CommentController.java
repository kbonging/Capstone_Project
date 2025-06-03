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
@RequestMapping("/api/community")
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/{communityIdx}/comments")
    public ResponseEntity<?> getCommentsByCommunity(@PathVariable int communityIdx) {
        List<CommentListResponseDTO> commentListByCommunityIdx = commentService.selectCommentsByCommunityIdx(communityIdx);
        return new ResponseEntity<>(commentListByCommunityIdx, HttpStatus.OK);
    }

    /**[댓글 등록 API] 최상위 + 대댓글 포함 [셀렉 조회할때 sortOrder 키워드 사용해서 자식댓글 순차적으로 조회]*/
    @PostMapping("/{communityIdx}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable int communityIdx,
            @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        try {
            log.info("[POST] : /api/"+communityIdx+"comments");
            commentService.insertComment(communityIdx, commentDTO, customUser);
            return ResponseEntity.ok("댓글 등록 성공");
        } catch (Exception e) {
            log.error("댓글 등록 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("댓글 등록 실패: " + e.getMessage());
        }
    }


}
