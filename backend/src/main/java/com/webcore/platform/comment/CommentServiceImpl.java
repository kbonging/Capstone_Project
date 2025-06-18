package com.webcore.platform.comment;

import com.webcore.platform.comment.dao.CommentDAO;
import com.webcore.platform.constants.CommentType;
import com.webcore.platform.comment.dto.CommentDTO;
import com.webcore.platform.comment.dto.CommentListResponseDTO;
import com.webcore.platform.member.dto.MemberDTO;
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

        // 💡 정렬 순서는 커뮤니티 or 캠페인에 따라 다르게 처리
        Integer maxSort;
        if (commentDTO.getCommunityIdx() != null) {
            maxSort = commentDAO.getMaxSortOrder(commentDTO.getCommunityIdx());
        } else {
            maxSort = commentDAO.getMaxSortOrderByCampaign(commentDTO.getCampaignIdx());
        }

        int sortOrder = (maxSort != null ? maxSort + 1 : 1);
        commentDTO.setSortOrder(sortOrder);

        //  댓글 계층 분기
        if (commentDTO.getParentId() == null) {
            //  최상위 댓글
            commentDTO.setDepth(0);
            commentDAO.insertComment(commentDTO); // keyProperty로 commentIdx 채워짐
            commentDAO.updateGroupIdToSelf(commentDTO.getCommentIdx());
        } else {
            // 🟡 대댓글
            Integer groupId = commentDAO.getGroupIdForParent(commentDTO.getParentId());
            Integer depth = commentDAO.getDepthForParent(commentDTO.getParentId());

            commentDTO.setGroupId(groupId);
            commentDTO.setDepth(depth + 1);

            commentDAO.insertReply(commentDTO);
        }

        log.info("댓글 등록 성공: {}", commentDTO);
    }

    /** 댓글 삭제 */
    @Override
    public int deleteComment(CommentDTO commentDTO) {
        int result = commentDAO.deleteComment(commentDTO);
        if(result > 0) {
            log.info("Delete Comment Successfully!! delete user's idx : {}", commentDTO.getMemberIdx());
        }
        return result;
    }

    /** 댓글 수정 */
    @Override
    public ResponseEntity<?> updateComment(int commentIdx, CommentDTO commentDTO, MemberDTO loginMember) {
        CommentDTO getComment = commentDAO.getCommentById(commentIdx);

        if (getComment == null) {
            log.info("수정할 댓글이 없습니다");
            return ResponseEntity.status(HttpStatus.OK).body("댓글이 존재하지 않습니다.");
        }

        int loginMemberIdx = loginMember.getMemberIdx();
        int writerMemberIdx = getComment.getMemberIdx();

        // 관리자 권한 확인
        boolean isAdmin = loginMember.getAuthDTOList().stream()
            .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuth()));

        // 작성자 본인 또는 관리자만 수정 가능
        if (loginMemberIdx != writerMemberIdx && !isAdmin) {
            log.info(loginMemberIdx + "와 " + writerMemberIdx + "가 달라요 (관리자 아님)");
            return ResponseEntity.status(HttpStatus.OK).body("댓글 작성자가 아닙니다.");
        }

        // 수정할 내용 설정
        commentDTO.setCommentIdx(commentIdx);         // URL path에서 받은 idx
        commentDTO.setMemberIdx(loginMemberIdx);      // 로그인 사용자 idx (관리자)

        int result = commentDAO.updateComment(commentDTO);

        if (result > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("댓글 수정이 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("댓글 수정에 실패했습니다.");
        }
    }

}
