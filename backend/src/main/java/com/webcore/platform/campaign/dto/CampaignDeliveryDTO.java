package com.webcore.platform.campaign.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CampaignDeliveryDTO extends CampaignDTO{
    /** 제품 구매 링크 */
    private String purchaseUrl;
}
