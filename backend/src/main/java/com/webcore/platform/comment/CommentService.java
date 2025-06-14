package com.webcore.platform.comment;

import com.webcore.platform.comment.dto.CommentDTO;
import com.webcore.platform.comment.dto.CommentListResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CommentService {

    List<CommentListResponseDTO> selectCommentsByCommunityIdx(int idx, String type);

    CommentDTO getCommentById(int commentIdx);

    void insertComment(CommentDTO commentDTO);

    int deleteComment(CommentDTO commentDTO);

    ResponseEntity<?> updateComment(CommentDTO commentDTO);
}
