package com.webcore.platform.service;

import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.response.CommunityDetailResponseDTO;
import com.webcore.platform.response.CommunityListResponseDTO;

import java.util.List;

public interface CommunityService {
    /** 커뮤니티 글 전체 조회*/
    List<CommunityListResponseDTO> selectCommunityList(CommunityDTO communityDTO);

    /** 커뮤니티  글 상세정보 */
    CommunityDetailResponseDTO getCommunityByIdx(int communityIdx, int memberIdx);

    /** 좋아요 등록 */
    boolean addLike(int communityIdx, int memberIdx);

    /** 좋아요 삭제 */
    boolean removeLike(int communityIdx, int memberIdx);

    /** 커뮤니티 글 등록 */
    int createPost(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deletePost(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updatePost(CommunityDTO communityDTO);
}
