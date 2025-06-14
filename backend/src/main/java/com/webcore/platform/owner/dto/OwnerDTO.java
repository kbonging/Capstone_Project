package com.webcore.platform.owner.dto;

import com.webcore.platform.member.dto.MemberDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 소상공인 DTO
 * extends MemberDTO
 * */
@Getter
@Setter
@ToString(callSuper = true)
public class OwnerDTO extends MemberDTO {
    /** 상호명 */
    private String businessName;
    /** 사업장관련 URL */
    private String businessUrl;
}
