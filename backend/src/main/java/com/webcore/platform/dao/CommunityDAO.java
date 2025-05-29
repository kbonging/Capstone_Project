package com.webcore.platform.dao;

import com.webcore.platform.domain.CommunityDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommunityDAO {
    /** 커뮤니티 글 전체 조회*/
    List<CommunityDTO> selectCommunityList(CommunityDTO communityDTO);

    /** 커뮤니티  글 상세정보 */
    CommunityDTO getCommunityByIdx(int communityIdx);

    /** 커뮤니티 글 등록 */
    int insertCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deleteCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updateCommunity(CommunityDTO communityDTO);
}
