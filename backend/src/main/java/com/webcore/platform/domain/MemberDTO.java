package com.webcore.platform.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)  // 부모 클래스 필드도 포함하도록 설정
public class MemberDTO extends DefaultDTO{
    /** 회원 고유번호 (PK) */
    private int memberIdx;
    /** 로그인 아이디 (중복 불가) */
    private String memberId;
    /** 회원 비밀번호 */
    private String memberPwd;
    /** 실명 (한글만 입력) */
    private String memberName;
    /** 이메일 주소 (중복 불가) */
    private String memberEmail;
    /** 휴대폰 번호 (선택 입력) */
    private String memberPhone;
    /** 프로필 이미지 URL (미작성 시 기본 이미지 사용) */
    private String profileImgUrl;
    /** 소개글 (선택 입력) */
    private String intro;
    /** 하트 수 (기본값: 0) */
    private int heartCount;
    /** 패널티 횟수 (기본값: 0) */
    private int penalty;

    /** 권한 목록*/
    List<MemberAuthDTO> authDTOList;
}
