package com.webcore.platform.campaign;

import com.webcore.platform.campaign.dto.CampaignDetailRes;

public interface CampaignDetailService {
  /**
   * 캠페인 상세 조회
   * @param id        캠페인 PK
   * @param memberId  로그인 사용자 PK (없으면 null 허용)
   * @return          상세 DTO
   */
  CampaignDetailRes getDetail(int id, Integer memberId);
}
