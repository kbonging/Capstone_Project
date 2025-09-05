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

  /** 캠페인 전체 목록 조회 */
  List<CampaignDetailResponseDTO> selectCampaignList(CampaignDTO campaignDTO);

  /** 캠페인 목록 수 조회 */
  int selectCampaignCount(CampaignDTO campaignDTO);

  /** 캠페인 상세페이지 조회 */
  CampaignDetailResponseDTO selectDetailCampaign(@Param("id") int id);

  int updateCampaignStatus(@Param("campaignIdx") int campaignIdx, @Param("status") String status);

  /** 캠페인 신청 페이지 조회 */
  CampaignApplyDTO selectApply(@Param("campaignIdx") int campaignIdx, @Param("memberIdx") Integer memberIdx);

  /** 캠페인 지원등록  */
  int insertApplication(@Param("campaignIdx") int campaignIdx,
      @Param("memberIdx")  int memberIdx,
      @Param("applyReason") String applyReason,
      @Param("applyStatusCode") String applyStatusCode);

  /** 캠페인 지원등록한 아이디 찾기  */
  Integer lastInsertId();

  /** 배송형일때 프로필정보에 주소 없으면 등록  */
  int updateReviewerAddress(@Param("memberIdx") int memberIdx,
      @Param("zipCode") String zipCode,
      @Param("address") String address,
      @Param("detailAddress") String detailAddress);
}
