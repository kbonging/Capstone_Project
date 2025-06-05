package com.webcore.platform.service;

import com.webcore.platform.common.CommentType;
import com.webcore.platform.dao.CommentDAO;
import com.webcore.platform.domain.CommentDTO;
import com.webcore.platform.response.CommentListResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentDAO commentDAO;

    /** 커뮤니티, 체험단 댓글 조회 로직 */
    @Override
    public List<CommentListResponseDTO> selectCommentsByCommunityIdx(int idx, String type) {

        CommentDTO commentDTO = new CommentDTO();

        if("COMMT001".equals(type)) {
            commentDTO.setCommunityIdx(idx);
        } else if ("COMMT002".equals(type)) {
            commentDTO.setCampaignIdx(idx);
        }

        return commentDAO.selectCommentListByCommunityIdx(commentDTO);
    }

    /** 댓글 1개 조회 */
    @Override
    public CommentDTO getCommentById(int commentIdx) {
        return commentDAO.getCommentById(commentIdx);
    }

    /**[댓글등록 서비스 로직] */
    @Override
    public void insertComment(CommentDTO commentDTO) {
        if (commentDTO.getCommunityIdx() != null) {
            commentDTO.setCommentType(CommentType.COMMUNITY); // "COMMT001"
        } else if (commentDTO.getCampaignIdx() != null) {
            commentDTO.setCommentType(CommentType.CAMPAIGN); // "COMMT002"
        } else {
            throw new IllegalArgumentException("댓글이 속할 게시글(campaignIdx/communityIdx)이 없습니다.");
        }

        /**[정렬값 계산] */
        Integer maxSort = commentDAO.getMaxSortOrder(commentDTO.getCommunityIdx());
        int sortOrder = (maxSort != null ? maxSort + 1 : 1);
        commentDTO.setSortOrder(sortOrder);

        /** [댓글 구분 처리] */
        if (commentDTO.getParentId() == null) {
            /** [최상위 댓글로직] */
            commentDTO.setDepth(0);
//            commentDTO.setCommentType(type);
            commentDAO.insertComment(commentDTO);
            commentDAO.updateGroupIdToSelf(commentDTO.getCommentIdx());
        } else {
            /** [대댓글] */
            Integer groupId = commentDAO.getGroupIdForParent(commentDTO.getParentId());
            Integer depth = commentDAO.getDepthForParent(commentDTO.getParentId());

            commentDTO.setGroupId(groupId);
            commentDTO.setDepth(depth + 1);
//            commentDTO.setCommentType(type);

            commentDAO.insertReply(commentDTO);
        }

        log.info("댓글 등록 성공: {}", commentDTO);
    }

    @Override
    public int deleteComment(CommentDTO commentDTO) {
        int result = commentDAO.deleteComment(commentDTO);
        if(result > 0) {
            log.info("Delete Comment Successfully!! delete user's idx : {}", commentDTO.getMemberIdx());
        }
        return result;
    }

    @Override
    public ResponseEntity<?> updateComment(CommentDTO commentDTO) {
        CommentDTO getComment = commentDAO.getCommentById(commentDTO.getCommentIdx());

        if(getComment == null) {
            log.info("수정할 게시글 없어 응애");
            return ResponseEntity.status(HttpStatus.OK).body("댓글이 존재하지 않습니다.");
        }

        int loginMember = commentDTO.getMemberIdx();
        int Member = getComment.getMemberIdx();

        if(loginMember != Member) {
            log.info(loginMember + "와" + Member +"가 달라요");
            return ResponseEntity.status(HttpStatus.OK).body("댓글 작성자가 아닙니다.");
        }

        commentDAO.updateComment(commentDTO);

        return ResponseEntity.status(HttpStatus.OK).body("댓글 수정이 완료되었습니다.");
    }

}
