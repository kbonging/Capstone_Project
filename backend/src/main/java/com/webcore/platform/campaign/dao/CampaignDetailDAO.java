package com.webcore.platform.campaign.dao;

import com.webcore.platform.campaign.dto.CampaignDetailRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CampaignDetailDAO {

  CampaignDetailRes findDetail(@Param("id") int id);

  CampaignDetailRes.VisitInfo findVisit(@Param("id") int id);
  CampaignDetailRes.DeliveryInfo findDelivery(@Param("id") int id);

  long countApplicants(@Param("id") long id); // 사용 안 하면 구현 생략 가능


}

