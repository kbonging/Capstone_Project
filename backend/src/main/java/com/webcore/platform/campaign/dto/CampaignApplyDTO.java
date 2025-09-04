// src/main/java/com/webcore/platform/campaign/dto/CampaignApplyPageDTO.java
package com.webcore.platform.campaign.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CampaignApplyDTO extends DefaultDTO {

  private Integer campaignIdx;
  private String title;
  private String shopName;
  private String thumbnailUrl;

  // 코드 + 명 (상세 DTO와 동일한 패턴 유지)
  private String campaignType;
  private String campaignTypeName;
  private String categoryCode;
  private String categoryName;
  private String channelCode;
  private String channelName;

  private String benefitDetail;
  private Integer recruitCount;
  private Long applicants;     // DEL_YN='N'만 집계
  private String productUrl;   // 배송/구매형이면 tb_campaign_delivery.PURCHASE_URL

  // 프론트 분기용 상태값
  private Boolean allowApply;       // 모집중 && 신청기간 내면 true
  private Boolean alreadyApplied;   // 로그인 사용자의 중복신청 여부

  // 배송형 주소 유도용
  private Boolean requireAddress;   // CAMP003(배송형) 또는 정책상 CAMP004
  private Boolean hasAddress;       // 로그인 사용자의 주소 등록 유무(null=비로그인)
  private String  zipCode;          // 기본 노출용
  private String  address;
  private String  detailAddress;
}
