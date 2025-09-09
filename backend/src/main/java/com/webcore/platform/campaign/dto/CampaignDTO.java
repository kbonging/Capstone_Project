package com.webcore.platform.campaign.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

/**
 * 공통 캠페인(체험단) 정보 DTO
 * extends DefaultDTO
 * */
@Getter
@Setter
@ToString(callSuper = true)
public class CampaignDTO extends DefaultDTO {
    /** 캠페인 고유번호 (PK) */
    private int campaignIdx;
    /** 소상공인 회원 고유번호 (FK) */
    private int memberIdx;
    /** 체험단 제목 */
    private String title;
    /** 캠페인 상호명 */
    private String shopName;
    /** 썸네일 이미지 경로 */
    private String thumbnailUrl;
    /** 담당자 연락처 */
    private String contactPhone;
    /** 캠페인 홍보 유형 (방문/포장/배송/구매) */
    private String campaignType;
    /** 캠페인 카테고리 코드 */
    private String categoryCode;
    /** 채널 코드 */
    private String channelCode;
    /** 체험 미션 내용 */
    private String mission;
    /** 키워드1 */
    private String keyword1;
    /** 키워드2 */
    private String keyword2;
    /** 키워드3 */
    private String keyword3;
    /** 제공 내역 상세 */
    private String benefitDetail;
    /** 모집 인원 */
    private Integer recruitCount;
    /** 신청 시작일 */
    private LocalDate applyStartDate;
    /** 신청 마감일 */
    private LocalDate applyEndDate;
    /** 리뷰어 발표일 */
    private LocalDate announceDate;
    /** 체험 시작일 */
    private LocalDate expStartDate;
    /** 체험 종료일 */
    private LocalDate expEndDate;
    /** 리뷰 작성 마감일 */
    private LocalDate deadlineDate;
    /** 캠페인 게시 상태 */
    private String campaignStatus;
    /** 모집 상태 */
    private String recruitStatus;

    /** 내 글만 보기 여부 (true or "")*/
    private String showMyParam;
}
