package com.webcore.platform.campaign.dao;

import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CampaignDAO {
  CampaignDetailResponseDTO selectDetailCampaign(@Param("id") int id);
}
