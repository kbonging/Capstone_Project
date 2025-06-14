package com.webcore.platform.reviewer;

import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import com.webcore.platform.reviewer.dto.ReviewerDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReviewerDAO {
    /** 리뷰어 프로필 등록 */
    void insertReviewerProfile(ReviewerDTO reviewerDTO);
    /** 리뷰어 채널 등록 */
    void insertReviewerChannel(ReviewerChannelDTO channelDTO);
    /** 회원 고유번호로 리뷰어 정보 조회 */
    ReviewerDTO selectReviewerByIdx(int memberIdx);
}
