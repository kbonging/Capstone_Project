package com.webcore.platform.member.dto;

import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MemberUpdateDTO {
    private int memberIdx;

    private String nickname;
    private String activityArea;
    private String activityTopic;

    private String businessName;
    private String businessUrl;

    private String memberPhone;
    private String birthDate;
    private String gender;
    private String zipCode;
    private String address;
    private String detailAddress;

    private List<ReviewerChannelDTO> reviewerChannelDTOList;
}
