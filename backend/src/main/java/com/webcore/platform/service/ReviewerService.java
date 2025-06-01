package com.webcore.platform.service;

import com.webcore.platform.domain.ReviewerDTO;

public interface ReviewerService {
    /** 리뷰어 회원 가입 */
    void signupReviewer(ReviewerDTO reviewerDTO);
    /** 회원 고유번호로 정보 조회 */
    ReviewerDTO selectReviewerByIdx(int memberIdx);
}
