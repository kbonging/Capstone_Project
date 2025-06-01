package com.webcore.platform.service;

import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.response.CommunityListResponseDTO;

import java.util.List;

public interface CommunityService {
    /** 커뮤니티 글 전체 조회*/
    List<CommunityListResponseDTO> selectCommunityList(CommunityDTO communityDTO);

    /** 커뮤니티  글 상세정보 */
    CommunityDTO getCommunityByIdx(int communityIdx);

    /** 커뮤니티 글 등록 */
    int createPost(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deletePost(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updatePost(CommunityDTO communityDTO);
}
