package com.webcore.platform.service;

import com.webcore.platform.dao.CommunityDAO;
import com.webcore.platform.domain.CommunityDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {
    private final CommunityDAO communityDAO;

    @Override
    public int createPost(CommunityDTO communityDTO) {
        int result = communityDAO.insertCommunity(communityDTO);
        if(result > 0) {
            log.info("Insert community successfully!! insert user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }

    @Override
    public int deletePost(CommunityDTO communityDTO) {
        int result = communityDAO.deleteCommunity(communityDTO);
        if(result > 0) {
            log.info("Delete Post successfully!! delete user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }
}
