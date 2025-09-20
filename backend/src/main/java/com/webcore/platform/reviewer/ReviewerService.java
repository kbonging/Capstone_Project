package com.webcore.platform.reviewer;

import com.webcore.platform.reviewer.dto.ReviewerCancelDTO;
import com.webcore.platform.reviewer.dto.ReviewerDTO;
import com.webcore.platform.reviewer.dto.ReviewerRunningCampaignDTO;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ReviewerService {
    /** 리뷰어 회원 가입 */
    void signupReviewer(ReviewerDTO reviewerDTO);
    /** 회원 고유번호로 리뷰어 정보 조회 */
    ReviewerDTO selectReviewerByIdx(int memberIdx);

    /**  리뷰어가 이미 승인(당첨)된 캠페인을 취소 처리
     *  비즈니스 규칙:
     *  - 단순 취소(SIMPLE)인 경우: 취소 횟수 누적
     *  - 협의 취소(NEGOTIATED)인 경우: 취소 횟수 미누적
     *  - 취소 사유(reason) 및 필요 시 증빙 이미지(images)를 저장
     *  - 실제 DB 업데이트(신청 상태 변경 등)와 로그 기록 수행
     *  */
    void cancelMyApproved(Integer memberIdx, ReviewerCancelDTO dto);

    /**
     * 특정 리뷰어가 현재 진행 중이며 취소 가능한 캠페인 목록을 조회.
     * - 해당 리뷰어가 이미 당첨된(application 승인) 상태
     * - 캠페인 발표일 ~ 리뷰 마감일 사이 기간
     * - 취소 가능 상태만 필터링
     */
    List<ReviewerRunningCampaignDTO> findRunningCampaignsForReviewer(@Param("memberIdx") Integer memberIdx);
}
