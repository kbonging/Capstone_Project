package com.webcore.platform.admin;

import com.webcore.platform.campaign.dao.CampaignDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService{

    private final CampaignDAO campaignDAO;

    /** 마감 기한 지난 캠페인 종료*/
    @Override
    @Transactional
    public int closeExpiredCampaigns() {
        return campaignDAO.updateExpiredCampaignsToClosed();
    }

}
