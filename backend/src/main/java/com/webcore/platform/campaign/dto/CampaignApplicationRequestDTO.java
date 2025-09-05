package com.webcore.platform.campaign.dto;


import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CampaignApplicationRequestDTO {

  private String applyReason;

  // 배송형 + 주소 미보유 시 프론트에서 채워 보내는 필드
  private String zipCode;
  private String address;
  private String detailAddress;
  private Boolean saveAddressToProfile; // true면 프로필에 저장
}
