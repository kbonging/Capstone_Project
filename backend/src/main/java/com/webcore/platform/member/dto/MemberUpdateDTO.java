package com.webcore.platform.member.dto;

import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MemberUpdateDTO {

    /** 공통 */
    private int memberIdx; // 멤버 고유 번호
    private String memberPhone; // 전화번호
    private String intro; // 소개글
    private String memberEmail; // 이메일
    private String profileImgUrl; // 프로필 이미지 경로

    /** 리뷰어 */
    private String nickname; // 닉네임
    private String activityArea; // 활동지역
    private String activityTopic; // 활동주제
    private String birthDate; // 생일
    private String gender; // 성별
    private String zipCode; // 우편번호
    private String address; // 주소
    private String detailAddress; // 상세주소
    private List<ReviewerChannelDTO> reviewerChannelList = new ArrayList<>(); // 리뷰어 채널 정보

    /** 소상공인 */
    private String businessName; // 상호명
    private String businessUrl; // 상호 URL

}
