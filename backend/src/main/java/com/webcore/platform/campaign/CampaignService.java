package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;

public interface CampaignService {

  //상세조회
  CampaignDetailResponseDTO getDetail(int id, Integer memberId);
}
