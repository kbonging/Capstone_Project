package com.webcore.platform.reviewer.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class ReviewerChannelDTO extends DefaultDTO {
    /** 채널 고유번호 (PK) */
    private int revChaIdx;
    /** 회원 고유번호 (FK) */
    private int memberIdx;
    /** 인플루언서 유형 코드 (공통 코드 INF_TYPE) */
    private String infTypeCodeId;
    /** 채널 주소 */
    private String channelUrl;
}
