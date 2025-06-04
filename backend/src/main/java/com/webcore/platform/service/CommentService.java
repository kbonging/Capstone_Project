package com.webcore.platform.service;

import com.webcore.platform.domain.CommentDTO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.response.CommentListResponseDTO;

import java.util.List;

public interface CommentService {

    List<CommentListResponseDTO> selectCommentsByCommunityIdx(int idx, String type);

    CommentDTO getCommentById(int commentIdx);

    void insertComment(CommentDTO commentDTO);

    int deleteComment(CommentDTO commentDTO);
}
