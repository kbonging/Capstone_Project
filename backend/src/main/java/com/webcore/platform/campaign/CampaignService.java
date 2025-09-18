package com.webcore.platform.campaign;
import com.webcore.platform.campaign.dto.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

public interface CampaignService {
  /**
   * 캠페인 게시글 목록과 페이징 정보를 함께 조회합니다.
   * - "campaignList": List<CampaignDetailResponseDTO> 캠페인 리스트
   * - "paginationInfo": PaginationInfo 페이징 관련 정보 객체
   */
  Map<String, Object> getCampaignList(CampaignDTO campaignDTO);

  /** 체험단 모집 글 등록 처리
   *  @param requestDto 캠페인 등록 요청 데이터 (제목, 상호명, 유형, 일정, 혜택 등)
   *  @return 등록된 캠페인의 고유 식별자 (CAMPAIGN_IDX)
   * */
  int createCampaign(Map<String, Object> requestDto);

  /** 체험단 모집 글 수정 처리
   *  @param requestDto 캠페인 등록 요청 데이터 (제목, 상호명, 유형, 일정, 혜택 등)
   *  @return 등록된 캠페인의 고유 식별자 (CAMPAIGN_IDX)
   * */
  int updateCampaign(Map<String, Object> requestDto);

  /** 캠페인 삭제 */
  boolean deleteCampaign(int campaignIdx);

  /** 캠페인 상세 정보 조회 */
  CampaignDetailResponseDTO getDetail(int campaignIdx, Integer memberIdx);

  /** 관리자 캠페인 상태 변경 (승인, 반려) */
  void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO);

  /** 신청 페이지용 요약 조회 */
  CampaignApplyDTO getApply(int campaignIdx, Integer memberIdx);

  /** 신청 하는 로직 */
  CampaignApplicationResponseDTO createApplication(int campaignIdx, int memberIdx, CampaignApplicationRequestDTO campaignApplicationRequestDTO);

  /** 캠페인 신청자 목록 조회 */
  Map<String, Object> getApplicantsByCampaign(int campaignIdx, int page, String searchCondition, String searchKeyword, String applyStatus);

  /** 캠페인 신청자 상태 변경 */
  void changeApplicantStatus(int applicationIdx, String newStatus);

  /** 캠페인 북마크 추가 */
  boolean addBookmark(int memberIdx, int campaignIdx);

  /** 캠페인 북마크 제거 */
  boolean removeBookmark(int memberIdx, int campaignIdx);

  /** 리뷰 URL + 파일 URL 저장 */
  void submitCampaignReview(int campaignId, int memberIdx, String reviewUrl, MultipartFile imageUrl) throws Exception;

  /** 리뷰를 등록할수 있는지 상태  */
  String findApplicationStatus(int campaignId, int memberIdx);

  /**
   * 소상공인 캠페인 선정 완료 처리
   * 1. 캠페인 상태 CLOSED로 변경
   * 2. 당첨자 조회
   * 3. 당첨자에게 알림 발송
   *
   * @param campaignIdx 캠페인 고유번호
   * @param memberIdx 로그인한 소상공인 회원번호
   */
  void completeCampaignSelection(int campaignIdx, int memberIdx);

  /** 리뷰어 진행 완료 캠페인 */
  Map<String, Object> getCompletedCampaigns(CampaignDTO campaignDTO);

  /** 리뷰어 진행중 캠페인 */
  Map<String, Object> getOngoingCampaigns(CampaignDTO campaignDTO);
}

