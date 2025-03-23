package com.vibeStay.platform.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)  // 부모 클래스 필드도 포함하도록 설정
public class MemberDTO extends DefaultDTO{
    private int memberIdx;
    private String memberId;
    private String memberPwd;
    private String memberName;
    private String memberEmail;
    private String memberNickname;
    private String profileImageUrl;

    /** 권한 목록*/
    List<MemberAuthDTO> authDTOList;
}
