package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.CampaignApplyDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignStatusUpdateDTO;

import java.util.List;
import java.util.Map;

public interface CampaignService {
  /** 체험단 모집 글 등록 처리
   *
   *  @param requestDto 캠페인 등록 요청 데이터 (제목, 상호명, 유형, 일정, 혜택 등)
   *  @return 등록된 캠페인의 고유 식별자 (CAMPAIGN_IDX)
   * */
  int createCampaign(Map<String, Object> requestDto);

  //상세조회
  CampaignDetailResponseDTO getDetail(int id, Integer memberId);

  //전체조회
  List<CampaignDetailResponseDTO> getCampaignList();

  public void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO);

  /** 신청 페이지용 요약 조회 */
  CampaignApplyDTO getApply(int campaignIdx, Integer memberIdx);

}

