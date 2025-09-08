package com.webcore.platform.mypage;

import com.webcore.platform.mypage.dto.MyCampaignDTO;

import java.util.Map;

public interface MyCampaignService {
  Map<String, Object> getMyCampaignList(MyCampaignDTO dto);
  void cancel(int memberIdx, int applicationIdx);
}

