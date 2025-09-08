// src/main/java/com/webcore/platform/mypage/dto/MyCampaignDTO.java
package com.webcore.platform.mypage.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.*;

/**
 * 내 체험단(My Page)에서 노출되는 캠페인 카드 데이터를 담는 DTO
 * - 신청 정보 + 캠페인 기본 정보 + 카드 화면 표시용 필드
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MyCampaignDTO extends DefaultDTO {

  /** 로그인한 사용자 고유번호 */
  private Integer memberIdx;

  /* ===================== 신청 정보 ===================== */
  /** 신청 고유번호 (tb_campaign_application.application_idx) */
  private Integer applicationIdx;

  /** 신청 상태 코드 (예: CAMAPP_PENDING / CAMAPP_APPROVED / CAMAPP_REJECTED) */
  private String applyStatusCode;

  /** 신청 상태명 (예: 대기, 당첨, 탈락) */
  private String applyStatusName;

  /* ===================== 캠페인 기본 정보 ===================== */
  /** 캠페인 고유번호 */
  private Integer campaignIdx;

  /** 캠페인 제목 */
  private String title;

  /** 상호명 (업체/스토어명) */
  private String shopName;

  /** 썸네일 이미지 경로(URL) */
  private String thumbnailUrl;

  /** 캠페인 유형 코드 (예: CAMP001, CAMP003 등) */
  private String campaignType;

  /** 캠페인 유형명 (예: 방문형, 배송형) */
  private String campaignTypeName;

  /** 카테고리 코드 */
  private String categoryCode;

  /** 카테고리명 (예: 맛집, 기타) */
  private String categoryName;

  /** 채널 코드 */
  private String channelCode;

  /** 채널명 (예: 블로그, 인스타그램, 유튜브, 릴스) */
  private String channelName;

  /* ===================== 카드 표시용 정보 ===================== */
  /** 혜택 설명 (예: 5만원 상품권, 부츠 양말 2세트 등) */
  private String benefitText;

  /** 모집 인원 수 */
  private Integer recruitCount;

  /** 현재 신청 인원 수 */
  private Integer appliedCount;

  /** 모집 마감일 (yyyy-MM-dd) */
  private String applyEndDate;

  /** 남은 일수 (마감일까지 D-day 계산) */
  private Integer remainDays;

  /** 취소 가능 여부 (true면 신청 취소 버튼 노출) */
  private Boolean cancelable;

  /** 당첨 시 지급 포인트 (없으면 null) */
  private Integer rewardPoint;
}
