package com.webcore.platform.campaign.dao;

import com.webcore.platform.campaign.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CampaignDAO {

  /** 캠페인 기본정보 등록 */
  int insertCampaign(CampaignDTO campaignDTO);

  /** 방문형/포장형 캠페인 등록 */
  int insertCampaignVisit(CampaignVisitDTO visitDTO);

  /** 배송형/구매형 캠페인 등록 */
  int insertCampaignDelivery(CampaignDeliveryDTO deliveryDTO);

  /** 캠페인 기본정보 수정 */
  int updateCampaign(CampaignDTO campaignDTO);

  /**  방문형/포장형 캠페인 수정 */
  int updateCampaignVisit(CampaignVisitDTO visitDTO);

  /**  배송형/구매형 캠페인 수정 */
  int updateCampaignDelivery(CampaignDeliveryDTO deliveryDTO);

  /** 캠페인 삭제 */
  int deleteCampaign(int campaignIdx);

  /** 캠페인 전체 목록 조회 */
  List<CampaignDetailResponseDTO> selectCampaignList(CampaignDTO campaignDTO);

  /** 캠페인 목록 수 조회 */
  int selectCampaignCount(CampaignDTO campaignDTO);

  /** 캠페인 상세페이지 조회 */
  CampaignDetailResponseDTO selectDetailCampaign(@Param("campaignIdx") int campaignIdx, @Param("memberIdx") Integer memberIdx);

  /** 캠페인 신청 페이지 조회 */
  CampaignApplyDTO selectApply(@Param("campaignIdx") int campaignIdx, @Param("memberIdx") Integer memberIdx);

  /** 캠페인 지원등록  */
  int insertApplication(@Param("campaignIdx") int campaignIdx,
      @Param("memberIdx")  int memberIdx,
      @Param("applyReason") String applyReason,
      @Param("applyStatusCode") String applyStatusCode);

  /** 캠페인 지원등록한 아이디 찾기  */
  Integer lastInsertId();

  /** 캠페인 신청자 총 개수 조회 */
  int countApplicantsByCampaign(int campaignIdx, String searchCondition, String searchKeyword, String applyStatus);

  /** 캠페인 신청자 목록 조회 */
  List<OwnerCampaignApplicantResponseDTO> selectApplicantsByCampaign(
          int campaignIdx,
          int firstIndex,
          int recordCount,
          String searchCondition,
          String searchKeyword,
          String applyStatus
  );

  /** 모집 인원 조회 */
  int getRecruitCountByCampaign(int campaignIdx);

  /** 현재 당첨된 인원 조회 */
  int getApprovedCountByCampaignForUpdate(int campaignIdx);

  /** 실제 신청이 존재하는지 체크 */
  OwnerCampaignApplicantResponseDTO getApplicantByIdx(int applicationIdx);

  /** 캠페인 신청자 상태 변경 */
  int updateApplicantStatus(@Param("applicationIdx") int applicationIdx,
                          @Param("newStatus") String newStatus);

  /** 배송형일때 프로필정보에 주소 없으면 등록  */
  int updateReviewerAddress(@Param("memberIdx") int memberIdx,
      @Param("zipCode") String zipCode,
      @Param("address") String address,
      @Param("detailAddress") String detailAddress);

  /** 북마크 추가 */
  int insertBookmark(@Param("memberIdx") int memberIdx,
                     @Param("campaignIdx") int campaignIdx);

  /** 북마크 제거 */
  int deleteBookmark(@Param("memberIdx") int memberIdx,
                     @Param("campaignIdx") int campaignIdx);

  /** 관리자 캠페인 상태(승인, 반려) 변경 */
  int updateCampaignStatus(@Param("campaignIdx") int campaignIdx, @Param("status") String status);

  /** 마감 기한 지난 캠페인 종료 */
  int updateExpiredCampaignsToClosed();

  /** 단일 캠페인 상태 CLOSED 처리 (선정 완료 버튼용) */
  int updateCampaignStatusToClosed(@Param("campaignIdx") int campaignIdx);

  /** 캠페인별 선정된 당첨자 조회 */
  List<Integer> selectWinnersByCampaignId(@Param("campaignIdx") int campaignIdx);

  /** 로그인 유저의 신청(application_idx) 조회 */
  Integer findApplicationIdx(@Param("campaignId") int campaignId,
      @Param("memberIdx") int memberIdx);

  /** 동일 신청에 리뷰 존재 여부 */
  int countReviewByApplication(@Param("applicationIdx") int applicationIdx);

  /** 리뷰 저장 */
  int insertCampaignReview(CampaignReviewDTO dto);

  /** 리뷰등록 페이지 갈수있는 승인상태 체크 */
  String selectApplicationStatus(@Param("campaignId") int campaignId,
      @Param("memberIdx") int memberIdx);
  }
