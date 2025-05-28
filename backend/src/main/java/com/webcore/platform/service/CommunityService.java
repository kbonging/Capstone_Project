package com.webcore.platform.service;

import com.webcore.platform.domain.CommunityDTO;

public interface CommunityService {
    /** 커뮤니티 글 가져오기 */
    CommunityDTO getCommunityByIdx(int communityIdx);

    /** 커뮤니티 글 등록 */
    int createPost(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deletePost(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updatePost(CommunityDTO communityDTO);
}
