package com.webcore.platform.service;

import com.webcore.platform.domain.ReviewerDTO;

public interface ReviewerService {
    /** 리뷰어 회원 가입 */
    void signupReviewer(ReviewerDTO reviewerDTO);
}
