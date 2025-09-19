package com.webcore.platform.reviewer.dto;

import java.time.LocalDateTime;
import lombok.Data;

/**
 * 리뷰어가 진행 중인(발표~마감, 승인 상태) 캠페인 정보 DTO
 */
@Data
public class ReviewerRunningCampaignDTO {
  private Integer applicationIdx;  // 신청 PK
  private Integer campaignId;      // 캠페인 PK
  private String title;            // 캠페인 제목
  private String thumbnailUrl;     // 썸네일 URL
  private LocalDateTime announceDate; // 발표일
  private LocalDateTime deadlineDate; // 마감일
}
