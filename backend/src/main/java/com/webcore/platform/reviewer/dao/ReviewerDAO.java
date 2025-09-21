package com.webcore.platform.reviewer.dao;

import com.webcore.platform.member.dto.MemberUpdateDTO;
import com.webcore.platform.reviewer.dto.ReviewerCancelDTO;
import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import com.webcore.platform.reviewer.dto.ReviewerDTO;

import com.webcore.platform.reviewer.dto.ReviewerRunningCampaignDTO;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewerDAO {
    /** 리뷰어 프로필 등록 */
    void insertReviewerProfile(ReviewerDTO reviewerDTO);
    /** 리뷰어 채널 등록 */
    void insertReviewerChannel(ReviewerChannelDTO channelDTO);
    /** 회원 고유번호로 리뷰어 정보 조회 */
    ReviewerDTO selectReviewerByIdx(int memberIdx);

    /** 리뷰어 기준 진행중(발표~마감)이며 당첨 상태인 캠페인 목록 */
    List<ReviewerRunningCampaignDTO> selectRunningCampaignsForReviewer(@Param("memberIdx") Integer memberIdx);

    // 내 당첨(Approved) 신청 1건 조회
    ReviewerCancelDTO findApprovedApplication(@Param("memberIdx") Integer memberIdx,
        @Param("campaignId") Integer campaignId);

    // CAMAPP_APPROVED -> CAMAPP_CANCEL
    int updateToCanceled(@Param("applicationIdx") Integer applicationIdx,
        @Param("memberIdx") Integer memberIdx);

    // SIMPLE이면 penalty +1
    int increaseMemberPenalty(@Param("memberIdx") Integer memberIdx);

    // 취소 로그 저장
    int insertCancelReviewer(ReviewerCancelDTO dto);

    /** 리뷰어 프로필 수정 */
    void updateReviewerProfile(MemberUpdateDTO dto);

    /** 리뷰어 채널 수정 */
    void upsertReviewerChannel(ReviewerChannelDTO dto);
}
