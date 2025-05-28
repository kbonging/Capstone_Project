package com.webcore.platform.dao;

import com.webcore.platform.domain.CommunityDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommunityDAO {

    /** 커뮤니티  글가져오기 */
    CommunityDTO getCommunityByIdx(int communityIdx);

    /** 커뮤니티 글 등록 */
    int insertCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 삭제 */
    int deleteCommunity(CommunityDTO communityDTO);

    /** 커뮤니티 글 수정 */
    int updateCommunity(CommunityDTO communityDTO);
}
