package com.webcore.platform.service;

import com.webcore.platform.common.CommentType;
import com.webcore.platform.dao.CommentDAO;
import com.webcore.platform.domain.CommentDTO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.response.CommentListResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentDAO commentDAO;

    @Override
    public List<CommentListResponseDTO> selectCommentsByCommunityIdx(int communityIdx) {
        return commentDAO.selectCommentListByCommunityIdx(communityIdx);
    }

    /**[댓글등록 서비스 로직] */
    @Override
    public void insertComment(int communityIdx, CommentDTO commentDTO, CustomUser customUser) {
        /**[로그인 사용자 정보 ]*/
        int memberIdx = customUser.getMemberDTO().getMemberIdx();

        /**[path,body 정보 등록]*/
        commentDTO.setCommunityIdx(communityIdx);
        commentDTO.setMemberIdx(memberIdx);

        /**[정렬값 계산] */
        Integer maxSort = commentDAO.getMaxSortOrder(communityIdx);
        int sortOrder = (maxSort != null ? maxSort + 1 : 1);
        commentDTO.setSortOrder(sortOrder);
        /** [댓글 구분 처리] */
        if (commentDTO.getParentId() == null) {
            /** [최상위 댓글로직] */
            commentDTO.setDepth(0);
            commentDTO.setCommentType(CommentType.COMMUNITY);
            commentDAO.insertComment(commentDTO);
            commentDAO.updateGroupIdToSelf(commentDTO.getCommentIdx());
        } else {
            /** [대댓글] */
            Integer groupId = commentDAO.getGroupIdForParent(commentDTO.getParentId());
            Integer depth = commentDAO.getDepthForParent(commentDTO.getParentId());

            commentDTO.setGroupId(groupId);
            commentDTO.setDepth(depth + 1);
            commentDTO.setCommentType(CommentType.COMMUNITY);

            commentDAO.insertReply(commentDTO);
        }

        log.info("댓글 등록 성공: {}", commentDTO);
    }


}
