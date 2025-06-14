package com.webcore.platform.comment;

import com.webcore.platform.comment.dto.CommentDTO;
import com.webcore.platform.comment.dto.CommentListResponseDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentDAO {
    /** 댓글 조회 */
    List<CommentListResponseDTO> selectCommentListByCommunityIdx(CommentDTO commentDTO);

    /** 댓글 1개 조회 */
    CommentDTO getCommentById(int commentIdx);

    /** 커뮤니티 댓글 최대 sort_order */
    Integer getMaxSortOrder(int communityIdx);

    /** 캠페인 댓글 최대 sort_order */
    Integer getMaxSortOrderByCampaign(int campaignIdx);

    /** 부모 댓글의 group_id 가져오기*/
    Integer getGroupIdForParent(int parentId);

     /** 부모 댓글의 depth 가져오기*/
    Integer getDepthForParent(int parentId);

     /** 최상위 댓글 등록 (parent_id 없이)*/
    void insertComment(CommentDTO commentDTO);

     /** 대댓글 등록*/
    void insertReply(CommentDTO commentDTO);

     /** 댓글 등록 후 자기 자신의 comment_idx로 group_id 갱신*/
    void updateGroupIdToSelf(int commentIdx);

    /** 댓글 삭제 */
    int deleteComment(CommentDTO commentDTO);

    /** 댓글 수정 */
    int updateComment(CommentDTO commentDTO);

}
