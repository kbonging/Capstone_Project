package com.webcore.platform.service;

import com.webcore.platform.response.CommentListResponseDTO;

import java.util.List;

public interface CommentService {
    List<CommentListResponseDTO> selectCommentsByCommunityIdx(int communityIdx);
}
