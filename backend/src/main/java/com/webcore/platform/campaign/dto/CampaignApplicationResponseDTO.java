package com.webcore.platform.campaign.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
/**
 * 캠페인 신청 Insert 후 생성된 신청 고유번호(applicationIdx)를
 * 프론트엔드나 호출자에게 응답으로 전달하기 위한 DTO.
 *
 * - applicationIdx : 방금 생성된 TB_CAMPAIGN_APPLICATION.APPLICATION_IDX 값
 *
 * - 필요 없을시 나중에 제거 할게요~
 * */
@Getter
@AllArgsConstructor
public class CampaignApplicationResponseDTO {
  private Integer applicationIdx;
}
