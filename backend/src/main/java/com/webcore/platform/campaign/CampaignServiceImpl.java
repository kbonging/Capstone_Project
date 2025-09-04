// src/main/java/com/webcore/platform/campaign/CampaignDetailServiceImpl.java
package com.webcore.platform.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.campaign.dao.CampaignDAO;
import com.webcore.platform.campaign.dto.*;
import com.webcore.platform.common.CommonService;
import com.webcore.platform.common.PaginationInfo;
import com.webcore.platform.constants.Paging;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
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
  public Map<String, Object> getCampaignList(CampaignDTO campaignDTO) {
    // 1. 전체 게시글 수 조회
    int totalRecord = campaignDAO.selectCampaignCount(campaignDTO);

    // 2. PaginationInfo 객체 셍성 및 세팅
    PaginationInfo paginationInfo = new PaginationInfo();
    paginationInfo.setCurrentPage(campaignDTO.getPage() <= 0 ? 1 : campaignDTO.getPage());
    paginationInfo.setBlockSize(Paging.PAGE_BLOCK_SIZE);
    paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
    paginationInfo.setTotalRecord(totalRecord);

    // 3. 조회 범위 인덱스 계산
    int firstIndex = paginationInfo.getFirstRecordIndex();
    int recordCnt = paginationInfo.getRecordCountPerPage();

    // 4. 시작인덱스와 limit 설정
    campaignDTO.setFirstIndex(firstIndex);
    campaignDTO.setRecordCount(recordCnt);

    // 5. 게시글 목록 조회
    log.info("게시글 목록 전달객체 campaignDTO : {}",campaignDTO);
    List<CampaignDetailResponseDTO> campaignList = campaignDAO.selectCampaignList(campaignDTO);

    Map<String, Object> result = new HashMap<>();
    result.put("campaignList", campaignList);
    result.put("paginationInfo", paginationInfo);

    return result;
  }

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


  @Override
  @Transactional(readOnly = true)
  public CampaignApplyDTO getApply(int campaignIdx, Integer memberIdx) {
    CampaignApplyDTO dto = campaignDAO.selectApply(campaignIdx, memberIdx);
    if (dto == null) throw new IllegalArgumentException("캠페인을 찾을 수 없습니다: " + campaignIdx);
    return dto;
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
