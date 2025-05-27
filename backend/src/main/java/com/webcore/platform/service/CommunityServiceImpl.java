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
    public int insertCommunity(CommunityDTO communityDTO) {
        int result = communityDAO.insertCommunity(communityDTO);
        if(result > 0) {
            log.info("Insert community successfully");
        }

        return result;
    }
}
