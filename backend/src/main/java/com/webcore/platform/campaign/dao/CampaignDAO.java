package com.webcore.platform.campaign.dao;

import com.webcore.platform.campaign.dto.CampaignApplyDTO;
import com.webcore.platform.campaign.dto.CampaignDTO;
import com.webcore.platform.campaign.dto.CampaignDeliveryDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignVisitDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CampaignDAO {

  /**
   * 캠페인 기본정보 등록
   */
  int insertCampaign(CampaignDTO campaignDTO);

  /**
   * 방문형/포장형 캠페인 등록
   */
  int insertCampaignVisit(CampaignVisitDTO visitDTO);

  /**
   * 배송형/구매형 캠페인 등록
   */
  int insertCampaignDelivery(CampaignDeliveryDTO deliveryDTO);

  CampaignDetailResponseDTO selectDetailCampaign(@Param("id") int id);

  //전체조회
  List<CampaignDetailResponseDTO> selectCampaignList();

  int updateCampaignStatus(@Param("campaignIdx") int campaignIdx, @Param("status") String status);


  CampaignApplyDTO selectApply(@Param("campaignIdx") int campaignIdx,
      @Param("memberIdx") Integer memberIdx);
}
