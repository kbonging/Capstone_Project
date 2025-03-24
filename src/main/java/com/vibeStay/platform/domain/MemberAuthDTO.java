package com.vibeStay.platform.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberAuthDTO {
    /** 권한 고유 번호 */
    private int authIdx;
    /** 회원 고유 번호*/
    private int memberIdx;
    /** 권한 */
    private String auth;

    public MemberAuthDTO() {
    }

    public MemberAuthDTO(int memberIdx, String auth) {
        this.memberIdx = memberIdx;
        this.auth = auth;
    }
}
