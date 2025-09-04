package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.CampaignDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignStatusUpdateDTO;

import java.util.Map;

public interface CampaignService {
  /**
   * 캠페인 게시글 목록과 페이징 정보를 함께 조회합니다.
   *
   * @param CampaignDTO 검색 조건 및 페이징 정보를 포함한 DTO
   * @return 게시글 목록과 페이징 정보를 담은 Map 객체
   *         - "campaignList": List<CampaignDetailResponseDTO> 캠페인 리스트
   *         - "paginationInfo": PaginationInfo 페이징 관련 정보 객체
   */
  Map<String, Object> getCampaignList(CampaignDTO campaignDTO);

  /** 체험단 모집 글 등록 처리
   *
   *  @param requestDto 캠페인 등록 요청 데이터 (제목, 상호명, 유형, 일정, 혜택 등)
   *  @return 등록된 캠페인의 고유 식별자 (CAMPAIGN_IDX)
   * */
  int createCampaign(Map<String, Object> requestDto);

  //상세조회
  CampaignDetailResponseDTO getDetail(int id, Integer memberId);

  /** 캠페인 게시 상태 변경 */
  public void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO);
}
