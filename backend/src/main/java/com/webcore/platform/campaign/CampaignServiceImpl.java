// src/main/java/com/webcore/platform/campaign/CampaignDetailServiceImpl.java
package com.webcore.platform.campaign;

import com.webcore.platform.campaign.dao.CampaignDAO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

// Service Impl
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignServiceImpl implements CampaignService {

  private final CampaignDAO campaignDAO;

  @Override
  @Transactional
  public int createCampaign(Map<String, Object> requestDto) {
    return 0;
  }

  @Override
  public CampaignDetailResponseDTO getDetail(int id, Integer memberId) {
    CampaignDetailResponseDTO dto = campaignDAO.selectDetailCampaign(id);
    if (dto == null) {
      throw new IllegalArgumentException("캠페인을 찾을 수 없습니다. id=" + id);
    }
    return dto;
  }
}
