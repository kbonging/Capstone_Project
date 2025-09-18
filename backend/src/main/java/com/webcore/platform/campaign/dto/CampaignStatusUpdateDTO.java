package com.webcore.platform.campaign.dto;

import lombok.Data;

/** 캠페인 게시 상태 변경 대기, 승인, 반려 */
@Data
public class CampaignStatusUpdateDTO {
    /** 캠페인 고유번호 */
    private int campaignIdx;

    /** 캠페인 상태 (대기, 승인, 반려) */
    private String status;
}
