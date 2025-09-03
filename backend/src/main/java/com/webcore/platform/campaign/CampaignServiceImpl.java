// src/main/java/com/webcore/platform/campaign/CampaignDetailServiceImpl.java
package com.webcore.platform.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.campaign.dao.CampaignDAO;
import com.webcore.platform.campaign.dto.*;
import com.webcore.platform.common.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignServiceImpl implements CampaignService {
  private final ObjectMapper objectMapper;
  private final CampaignDAO campaignDAO;
  private final CommonService commonService;

  @Override
  @Transactional
  public int createCampaign(Map<String, Object> requestDto) {
    // 1. 캠페인 기본 등록
    CampaignDTO campaignDTO = objectMapper.convertValue(requestDto, CampaignDTO.class);

    // 기본값 세팅 (공통코드 서비스 활용)
    if (campaignDTO.getCampaignStatus() == null) {
      campaignDTO.setCampaignStatus(commonService.getDefaultCode("CAM_STA"));
    }
    if (campaignDTO.getRecruitStatus() == null) {
      campaignDTO.setRecruitStatus(commonService.getDefaultCode("REC_STA"));
    }

    campaignDAO.insertCampaign(campaignDTO); // PK 자동생성

    // 2. 유형별 분기 처리
    String type = campaignDTO.getCampaignType();

    if ("CAMP001".equals(type) || "CAMP002".equals(type)) {
      // expDay 리스트 → 문자열 변환
      Object expDayObj = requestDto.get("expDay");
      String expDayStr = "";
      if (expDayObj instanceof List<?> expDayList) {
        expDayStr = String.join("/", expDayList.stream()
                .map(String::valueOf)
                .toArray(String[]::new));
      }
      requestDto.put("expDay", expDayStr);

      // 방문형/포장형
      CampaignVisitDTO visitDTO = objectMapper.convertValue(requestDto, CampaignVisitDTO.class);
      visitDTO.setCampaignIdx(campaignDTO.getCampaignIdx()); // PK 설정

      log.info("방문형/포장형 visitDTO -> {}", visitDTO);
      campaignDAO.insertCampaignVisit(visitDTO);
    } else if ("CAMP003".equals(type) || "CAMP004".equals(type)) {
      // 배송형/구매형
      CampaignDeliveryDTO deliveryDTO = objectMapper.convertValue(requestDto, CampaignDeliveryDTO.class);
      deliveryDTO.setCampaignIdx(campaignDTO.getCampaignIdx()); // PK 설정

      log.info("배송형/구매형 deliveryDTO -> {}", deliveryDTO);
      campaignDAO.insertCampaignDelivery(deliveryDTO);
    }

    // 3. 생성된 캠페인 PK 반환
    return campaignDTO.getCampaignIdx();
  }

  @Override
  public CampaignDetailResponseDTO getDetail(int id, Integer memberId) {
    CampaignDetailResponseDTO dto = campaignDAO.selectDetailCampaign(id);
    if (dto == null) {
      throw new IllegalArgumentException("캠페인을 찾을 수 없습니다. id=" + id);
    }
    return dto;
  }

  // 캠페인 전체 조회 (데이터도 가져옴)
  @Override
    public List<CampaignDetailResponseDTO> getCampaignList() {
      return campaignDAO.selectCampaignList();
  }

  // 캠페인 게시 상태 변경
    @Override
    @Transactional
    public void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO) {
        log.info("Updating campaign status for ID{} to {}", updateDTO.getCampaignIdx(), updateDTO.getStatus());
        int rowsAffected = campaignDAO.updateCampaignStatus(updateDTO.getCampaignIdx(), updateDTO.getStatus());

        if(rowsAffected == 0) {
            log.warn("Failed to update status for campaign ID {}. Campaign not found or no changes mode.", updateDTO.getCampaignIdx());
        } else {
            log.info("Successfully updated status for campaign ID {}.", updateDTO.getCampaignIdx());
        }
    }
}
