package com.webcore.platform.service;

import com.webcore.platform.dao.CommunityDAO;
import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.response.CommunityListResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {
    private final CommunityDAO communityDAO;

    @Override
    public List<CommunityListResponseDTO> selectCommunityList(CommunityDTO communityDTO) {
        return communityDAO.selectCommunityList(communityDTO);
    }

    @Override
    public CommunityDTO getCommunityByIdx(int communityIdx) {
        return communityDAO.getCommunityByIdx(communityIdx);
    }

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

    @Override
    public int updatePost(CommunityDTO communityDTO) {
        int result = communityDAO.updateCommunity(communityDTO);
        if(result > 0) {
            log.info("Update Post successfully!! update user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }
}
