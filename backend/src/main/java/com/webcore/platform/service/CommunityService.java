package com.webcore.platform.service;

import com.webcore.platform.domain.CommunityDTO;

public interface CommunityService {
    /** 커뮤니티 글 등록 */
    int registCommunity(CommunityDTO communityDTO);
}
