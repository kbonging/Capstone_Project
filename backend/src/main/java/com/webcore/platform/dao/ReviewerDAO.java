package com.webcore.platform.dao;

import com.webcore.platform.domain.ReviewerChannelDTO;
import com.webcore.platform.domain.ReviewerDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReviewerDAO {
    /** 리뷰어 프로필 등록 */
    void insertReviewerProfile(ReviewerDTO reviewerDTO);
    /** 리뷰어 채널 등록 */
    void insertReviewerChannel(ReviewerChannelDTO channelDTO);
}
