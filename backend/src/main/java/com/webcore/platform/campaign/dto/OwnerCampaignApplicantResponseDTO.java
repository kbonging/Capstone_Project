package com.webcore.platform.campaign.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OwnerCampaignApplicantResponseDTO extends DefaultDTO {
    /** 신청 고유번호 */
    private Integer applicationIdx;

    /** 회원 고유번호 */
    private Integer memberIdx;

    /** 닉네임(TB_REVIEWER_PROFILE) */
    private String nickname;

    /** 신청 사유 */
    private String applyReason;

    /** 신청 상태명 (TB_COMMON_CODE의 CODE_NM) */
    private String applyStatusName;

    /** 신청 상태 코드 (TB_COMMON_CODE의 CODE_ID) */
    private String applyStatusCode;

}
