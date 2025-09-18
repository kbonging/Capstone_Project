package com.webcore.platform.mypage.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookmarkDTO extends DefaultDTO {

    /** 캠페인 고유번호 */
    private int campaignIdx;

    /** 멤버 고유번호 */
    private Integer memberIdx;

    /** 모집 상태 */
    private String recruitStatus;

    /** 썸네일 경로 */
    private String thumbnailUrl;

    /** 제목 */
    private String title;

    /** 캠페인 타입 이름 */
    private String campaignTypeName;

    /** 카테고리 이름 */
    private String categoryName;

    /** 채널 이름 */
    private String channelName;

    /** 제공 혜택 */
    private String benefitDetail;

    /** 모집 인원 */
    private int recruitCount;

    /** 신청 마감일 */
    private String applyEndDate;

    /** 결과 발표일 */
    private String announceDate;

    /** 신청 인원수 */
    private int applicationCount;

}
