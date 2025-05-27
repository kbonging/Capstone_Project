package com.webcore.platform.dao;

import com.webcore.platform.domain.CommunityDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommunityDAO {
    /** 커뮤니티 글 등록 */
    int insertCommunity(CommunityDTO communityDTO);
}
