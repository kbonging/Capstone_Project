package com.webcore.platform.dao;

import com.webcore.platform.response.CommentListResponseDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentDAO {
    /** 커뮤니티 댓글 조회 */
    List<CommentListResponseDTO> selectCommentListByCommunityIdx(int communityIdx);
}
