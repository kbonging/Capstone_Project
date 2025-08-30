package com.webcore.platform.campaign.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.webcore.platform.common.dto.DefaultDTO;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL) // null 값인 필드는 JSON 직렬화 시 제외
public class CampaignDetailResponseDTO extends DefaultDTO {

  /** 캠페인 고유 번호 (PK) */
  private Integer campaignIdx;

  /** 등록자(회원) 고유 번호 (FK → MEMBER 테이블) */
  private Integer memberIdx;

  /** 캠페인 제목 */
  private String title;

  /** 주최자 / 업체명 (가맹점 이름) */
  private String shopName;

  /** 캠페인 썸네일 이미지 URL */
  private String thumbnailUrl;

  /** 담당자 연락처 */
  private String contactPhone;

  /** 캠페인 유형 코드 (예: CAMP001=방문형, CAMP003=배송형) */
  private String campaignType;

  /** 카테고리 코드 */
  private String categoryCode;

  /** 카테고리 이름 (조인으로 조회 시 제공) */
  private String categoryName;

  /** 채널 코드 (예: BLOG, INSTA 등) */
  private String channelCode;

  /** 채널 이름 (조인으로 조회 시 제공) */
  private String channelName;

  /** 체험단 미션 설명 (HTML 가능) */
  private String mission;

  /** 리뷰 키워드 1 */
  private String keyword1;

  /** 리뷰 키워드 2 */
  private String keyword2;

  /** 리뷰 키워드 3 */
  private String keyword3;

  /** 제공 혜택/리워드 상세 */
  private String benefitDetail;

  /** 모집 인원 수 */
  private Integer recruitCount;

  // ── 일정 관련 ────────────────────────────────
  /** 신청 시작일 */
  private LocalDate applyStart;

  /** 신청 종료일 */
  private LocalDate applyEnd;

  /** 리뷰어 발표일 */
  private LocalDate announce;

  /** 체험 시작일 */
  private LocalDate expStart;

  /** 체험 종료일 */
  private LocalDate expEnd;

  /** 리뷰 마감일 */
  private LocalDate deadline;

  // ── 상태값 ────────────────────────────────
  /** 모집 상태 코드 (예: REC001=모집중, REC002=마감 등) */
  private String recruitStatus;

  /** 캠페인 진행 상태 (예: PROGRESS=진행중, END=종료 등) */
  private String campaignStatus;

  // ── 방문형 캠페인 정보 ─────────────────────────
  /** 방문 주소 */
  private String address;

  /** 방문 상세 주소 */
  private String addressDetail;

  /** 방문 가능 요일/날짜 (예: 월~금, 주말 등) */
  private String day;

  /** 영업 시작 시간 */
  private String startTime;

  /** 영업 종료 시간 */
  private String endTime;

  /** 예약 시 유의사항 */
  private String reservationNotice;

  /** 지도 URL (네이버 지도, 카카오 지도 등) */
  private String mapUrl;

  // ── 배송형 캠페인 정보 ────────────────────────
  /** 제품 구매/신청 URL */
  private String purchaseUrl;

  /** 제품 상세 URL (productUrl, fallback 용) */
  private String productUrl;

  // ── 선택 정보 ────────────────────────────────
  /** 지원자 수 (TB_CAMPAIGN_APPLY에서 COUNT 집계) */
  private long applicants;



}
