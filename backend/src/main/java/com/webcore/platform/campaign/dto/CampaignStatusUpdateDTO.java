package com.webcore.platform.campaign.dto;

import lombok.Data;

/** 캠페인 게시 상태 변경 대기, 승인, 반려 */
@Data
public class CampaignStatusUpdateDTO {
    private int campaignIdx;

    private String status;
}
