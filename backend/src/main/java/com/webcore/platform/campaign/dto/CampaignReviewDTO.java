// src/main/java/.../campaign/dto/CampaignReviewDTO.java
package com.webcore.platform.campaign.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CampaignReviewDTO extends DefaultDTO {
  private Integer reviewIdx;        // TB_REVIEW.REVIEW_IDX
  private Integer applicationIdx;   // FK: TB_CAMPAIGN_APPLICATION
  private String reviewUrl;         // 리뷰 본문 URL
  private String imageUrl;          // 대표/증빙 이미지 URL
}
