package com.webcore.platform.mypage.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 내가 신청한 캠페인 DTO
 * - DB에서 조회한 컬럼들을 담음
 * - 프론트에 내려줄 displayStatus(발표일 이전에는 무조건 대기)도 포함
 */
@Getter
@Setter
@ToString
public class MyCampaignDTO extends DefaultDTO {

  /** 로그인 사용자 고유번호*/
  private Integer memberIdx;

  /** 캠페인 신청 고유번호 */
  private Integer applicationIdx;

  /** 실제 신청 상태 코드 (예: CAMAPP_PENDING, CAMAPP_APPROVED, ...) */
  private String  applyStatusCode;

  /** 실제 신청 상태 이름 (공통코드명) */
  private String  applyStatusName;

  /** 발표일 (yyyy-MM-dd) */
  private String  announceDate;

  /** 캠페인 고유번호 */
  private Integer campaignIdx;

  /** 캠페인 제목 */
  private String  title;

  /** 상호명 */
  private String  shopName;

  /** 썸네일 이미지 URL */
  private String  thumbnailUrl;

  /** 캠페인 유형 코드/이름 */
  private String  campaignType;
  private String  campaignTypeName;

  /** 카테고리 코드/이름 */
  private String  categoryCode;
  private String  categoryName;

  /** 채널 코드/이름 */
  private String  channelCode;
  private String  channelName;

  /** 제공 혜택 설명 */
  private String  benefitText;

  /** 모집 인원 */
  private Integer recruitCount;

  /** 현재 지원자 수 */
  private Integer appliedCount;

  /** 신청 마감일 (yyyy-MM-dd) */
  private String  applyEndDate;

  /** 마감일까지 남은 일수 (DB DATEDIFF) */
  private Integer remainDays;

  /** 리뷰 보상 포인트 (있을 경우) */
  private Integer rewardPoint;

  /** 수정일, 삭제여부 */
  private String modDate;
  private String delYn;

  // ===== 프론트 표시 전용 필드 =====

  /** 화면에 보여줄 상태 코드 (발표일 이전 → 무조건 대기) */
  private String displayStatusCode;

  /** 화면에 보여줄 상태 이름 */
  private String displayStatusName;

  /** 취소 가능 여부 */
  private Boolean cancelable;
}
