package com.webcore.platform.campaign.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // null 필드는 JSON에서 제외
public class CampaignDetailRes {

  private Integer campaignIdx;
  private Integer memberIdx;
  private String title;
  private String shopName;
  private String thumbnailUrl;
  private String contactPhone;
  private String campaignType;
  private String categoryCode;
  private String channelCode;

  private String mission;
  private String keyword1;
  private String keyword2;
  private String keyword3;
  private String benefitDetail;
  private Integer recruitCount;

  // ── DB 매핑용(응답에 노출 X) ───────────────────────────────
  @JsonIgnore private LocalDate applyStart;
  @JsonIgnore private LocalDate applyEnd;
  @JsonIgnore private LocalDate announce;
  @JsonIgnore private LocalDate expStart;
  @JsonIgnore private LocalDate expEnd;
  @JsonIgnore private LocalDate deadline;

  private String recruitStatus;
  private String campaignStatus;

  // 타입별 부가 정보
  @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
  public static class VisitInfo {
    private String address;
    private String addressDetail;
    private String day;
    private String startTime;
    private String endTime;
    private String reservationNotice;
  }

  @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
  public static class DeliveryInfo {
    private String purchaseUrl;
  }

  private VisitInfo visitInfo;
  private DeliveryInfo deliveryInfo;

  // 선택 정보
  private long applicants; // 지원자 수 (TB_CAMPAIGN_APPLY에서 집계)

  // ── 응답용 dates 묶음 ─────────────────────────────────────
  @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
  public static class Dates {
    private LocalDate applyStart;
    private LocalDate applyEnd;
    private LocalDate announce;
    private LocalDate expStart;
    private LocalDate expEnd;
    private LocalDate deadline;
  }

  @JsonProperty("dates")
  private Dates dates;

  /** DB에서 원본 날짜 필드 세팅 후 호출해서 dates 묶음 구성 */
  public void bindDates() {
    this.dates = Dates.builder()
        .applyStart(this.applyStart)
        .applyEnd(this.applyEnd)
        .announce(this.announce)
        .expStart(this.expStart)
        .expEnd(this.expEnd)
        .deadline(this.deadline)
        .build();
  }
}
