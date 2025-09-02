package com.webcore.platform.campaign.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)  // 부모 클래스 필드 포함
public class CampaignVisitDTO extends CampaignDTO{
    /** 체험 주소 */
    private String address;
    /** 상세 주소 */
    private String addressDetail;
    /** 체험 가능 요일 (예: 월,화,수) */
    private String EXP_DAY;
    /** 체험 시작 시간 (HH:mm) */
    private String startTime;
    /** 체험 종료 시간 (HH:mm) */
    private String endTime;
    /** 예약 안내 사항 */
    private String reservationNotice;
}
