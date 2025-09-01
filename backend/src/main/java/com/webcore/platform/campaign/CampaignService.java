package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;

import java.util.Map;

public interface CampaignService {
  /** 체험단 모집 글 등록 처리 */
  int createCampaign(Map<String, Object> requestDto);


  //상세조회
  CampaignDetailResponseDTO getDetail(int id, Integer memberId);
}
