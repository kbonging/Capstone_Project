package com.webcore.platform.controller;

import com.webcore.platform.response.CommentListResponseDTO;
import com.webcore.platform.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
