package com.webcore.platform.community;

import com.webcore.platform.community.dto.CommunityDTO;
import com.webcore.platform.community.dto.CommunityDetailResponseDTO;

import java.util.Map;

public interface CommunityService {
    /**
     * 커뮤니티 게시글 목록과 페이징 정보를 함께 조회합니다.
     *
     * @param communityDTO 검색 조건 및 페이징 정보를 포함한 DTO
     * @return 게시글 목록과 페이징 정보를 담은 Map 객체
     *         - "communityList": List<CommunityListResponseDTO> 게시글 데이터 리스트
     *         - "paginationInfo": PaginationInfo 페이징 관련 정보 객체
     */
    Map<String, Object> getCommunityListResult(CommunityDTO communityDTO);

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
