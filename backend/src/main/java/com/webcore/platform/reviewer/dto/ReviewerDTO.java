package com.webcore.platform.reviewer.dto;

import com.webcore.platform.member.dto.MemberDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)
public class ReviewerDTO extends MemberDTO {
//    /** 회원 고유번호 (PK, FK) */
//    private int memberIdx; // MemberDTO에서 상속받고 있음
    /** 닉네임 */
    private String nickname;
    /** 성별 */
    private String gender; // M/F
    /** 생년월일 */
    private String birthDate;
    /** 활동지역 */
    private String activityArea;
    /** 활동주제 (공통코드 ACT_TOPIC) */
    private String activityTopic;
    /** 우편번호 */
    private String zipCode;
    /** 주소 */
    private String address;
    /** 상세주소 */
    private String detailAddress;

    /** 리뷰어 채널 리스트 */
    private List<ReviewerChannelDTO> reviewerChannelList;

}
