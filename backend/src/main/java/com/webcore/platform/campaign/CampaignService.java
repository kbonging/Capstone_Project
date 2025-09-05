package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.CampaignDTO;
import com.webcore.platform.campaign.dto.CampaignApplyDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignStatusUpdateDTO;

import java.util.Map;

public interface CampaignService {
  /**
   * 캠페인 게시글 목록과 페이징 정보를 함께 조회합니다.
   * - "campaignList": List<CampaignDetailResponseDTO> 캠페인 리스트
   * - "paginationInfo": PaginationInfo 페이징 관련 정보 객체
   */
  Map<String, Object> getCampaignList(CampaignDTO campaignDTO);

  /** 체험단 모집 글 등록 처리
   *  @param requestDto 캠페인 등록 요청 데이터 (제목, 상호명, 유형, 일정, 혜택 등)
   *  @return 등록된 캠페인의 고유 식별자 (CAMPAIGN_IDX)
   * */
  int createCampaign(Map<String, Object> requestDto);

  //상세조회
  CampaignDetailResponseDTO getDetail(int id, Integer memberIdx);

  /** 관리자 캠페인 상태 변경 (승인, 반려) */
  void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO);

  /** 신청 페이지용 요약 조회 */
  CampaignApplyDTO getApply(int campaignIdx, Integer memberIdx);

  /** 캠페인 북마크 추가 */
  boolean addBookmark(int memberIdx, int campaignIdx);

  /** 캠페인 북마크 제거 */
  boolean removeBookmark(int memberIdx, int campaignIdx);

}

