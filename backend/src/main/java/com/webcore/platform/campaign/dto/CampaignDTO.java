package com.webcore.platform.campaign.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CampaignDTO extends DefaultDTO {

  /** 캠페인 고유 IDX (PK) */
  private Integer campaignIdx;

  /** 등록자(회원) IDX (FK → MEMBER 테이블) */
  private Integer memberIdx;

  /** 캠페인 제목 */
  private String title;

  /** 가맹점 / 업체명 */
  private String shopName;

  /** 썸네일 이미지 URL */
  private String thumbnailUrl;

  /** 담당자 연락처 */
  private String contactPhone;

  /** 캠페인 타입 (예: CAMP001=방문/포장형, CAMP003=배송/구매형 등) */
  private String campaignType;

  /** 카테고리 코드 */
  private String categoryCode;

  /** 채널 코드 (예: 블로그, 인스타 등) */
  private String channelCode;

  /** 캠페인 미션 설명 */
  private String mission;

  /** 리뷰 키워드1 */
  private String keyword1;

  /** 리뷰 키워드2 */
  private String keyword2;

  /** 리뷰 키워드3 */
  private String keyword3;

  /** 리워드 / 혜택 상세 설명 */
  private String benefitDetail;

  /** 모집 인원 수 */
  private Integer recruitCount;

  // ── 날짜 관련 ───────────────────────────────

  /** 신청 시작일 */
  private LocalDate applyStart;

  /** 신청 종료일 */
  private LocalDate applyEnd;

  /** 발표일 */
  private LocalDate announce;

  /** 체험 시작일 */
  private LocalDate expStart;

  /** 체험 종료일 */
  private LocalDate expEnd;

  /** 리뷰 마감일 */
  private LocalDate deadline;

  // ── 상태값 ───────────────────────────────

  /** 모집 상태 (예: 모집중, 모집완료 등) */
  private String recruitStatus;

  /** 캠페인 진행 상태 (예: 진행중, 종료 등) */
  private String campaignStatus;

  // ── 방문형 필드 ───────────────────────────────

  /** 방문 주소 */
  private String address;

  /** 방문 상세 주소 */
  private String addressDetail;

  /** 방문 가능 요일/날짜 */
  private String day;

  /** 방문 시작 시간 */
  private String startTime;

  /** 방문 종료 시간 */
  private String endTime;

  /** 예약 시 유의사항 */
  private String reservationNotice;

  // ── 배송형 필드 ───────────────────────────────

  /** 구매 / 신청 URL */
  private String purchaseUrl;

  // ── 선택 정보 ───────────────────────────────

  /** 지원자 수 (TB_CAMPAIGN_APPLY 집계) */
  private long applicants;
}
