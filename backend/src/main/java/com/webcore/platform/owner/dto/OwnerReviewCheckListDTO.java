// src/main/java/.../owner/dto/OwnerReviewCheckListDTO.java
package com.webcore.platform.owner.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Data;

import java.util.List;

@Data
public class OwnerReviewCheckListDTO extends DefaultDTO {
  private Long reviewIdx;
  private Long applicationIdx;
  private Long campaignIdx;
  private Integer reviewerMemberIdx;

  private String reviewerName;
  private String channelCode;   // CAMC001...
  private String channelName;   // 공통코드 한글명

  private String reviewUrl;
  private String imageUrl;      // DB는 단일 이미지
  private String submittedAt;   // yyyy-MM-dd HH:mm

  // 응답 편의
  private String status;        // "제출"
  private List<String> images;  // imageUrl -> [imageUrl]
}
