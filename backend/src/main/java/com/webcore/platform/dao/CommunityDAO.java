package com.webcore.platform.dao;

import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.response.CommunityDetailResponseDTO;
import com.webcore.platform.response.CommunityListResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityDAO {
    /** 커뮤니티 글 전체 조회*/
    List<CommunityListResponseDTO> selectCommunityList(CommunityDTO communityDTO);

    /** 커뮤니티 글 상세정보 */
    CommunityDetailResponseDTO getCommunityByIdx(@Param("communityIdx") int communityIdx,
                                                 @Param("memberIdx") int memberIdx);
    /** 좋아요 등록*/
    int insertLike(@Param("communityIdx") int communityIdx,
                   @Param("memberIdx") int memberIdx);
    /** 좋아요 삭제*/
    int deleteLike(@Param("communityIdx") int communityIdx,
                   @Param("memberIdx") int memberIdx);
    /** 커뮤니티 조회수 증가 */
    void increaseViewCount(int communityIdx);

    /** 커뮤니티 글 등록 */
    int insertCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deleteCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updateCommunity(CommunityDTO communityDTO);
}
