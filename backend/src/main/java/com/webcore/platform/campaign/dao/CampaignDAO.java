package com.webcore.platform.campaign.dao;

import com.webcore.platform.campaign.dto.CampaignDTO;
import com.webcore.platform.campaign.dto.CampaignDeliveryDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignVisitDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CampaignDAO {
  /** 캠페인 기본정보 등록 */
  int insertCampaign(CampaignDTO campaignDTO);
  /** 방문형/포장형 캠페인 등록 */
  int insertCampaignVisit(CampaignVisitDTO visitDTO);
  /** 배송형/구매형 캠페인 등록 */
  int insertCampaignDelivery(CampaignDeliveryDTO deliveryDTO);
  /** 캠페인 전체 목록 조회 */
  List<CampaignDetailResponseDTO> selectCampaignList(CampaignDTO campaignDTO);
  /** 캠페인 목록 수 조회 */
  int selectCampaignCount(CampaignDTO campaignDTO);

  CampaignDetailResponseDTO selectDetailCampaign(@Param("id") int id);

  int updateCampaignStatus(@Param("campaignIdx") int campaignIdx, @Param("status") String status);
}
