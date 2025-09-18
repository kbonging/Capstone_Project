// src/main/java/com/webcore/platform/campaign/CampaignDetailServiceImpl.java
package com.webcore.platform.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.campaign.dao.CampaignDAO;
import com.webcore.platform.campaign.dto.*;
import com.webcore.platform.common.CommonService;
import com.webcore.platform.common.PaginationInfo;
import com.webcore.platform.constants.Paging;
import com.webcore.platform.file.FileStorageService;
import com.webcore.platform.notification.NotificationService;
import com.webcore.platform.notification.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignServiceImpl implements CampaignService {
  private final ObjectMapper objectMapper;
  private final CampaignDAO campaignDAO;
  private final CommonService commonService;
  private final FileStorageService fileStorageService;
  private final NotificationService notificationService;

  @Override
  public Map<String, Object> getCampaignList(CampaignDTO campaignDTO) {
    // 1. 전체 게시글 수 조회
    int totalRecord = campaignDAO.selectCampaignCount(campaignDTO);

    // 2. PaginationInfo 객체 셍성 및 세팅
    PaginationInfo paginationInfo = new PaginationInfo();
    paginationInfo.setCurrentPage(campaignDTO.getPage() <= 0 ? 1 : campaignDTO.getPage());
    paginationInfo.setBlockSize(Paging.PAGE_BLOCK_SIZE);
    paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
    paginationInfo.setTotalRecord(totalRecord);

    // 3. 조회 범위 인덱스 계산
    int firstIndex = paginationInfo.getFirstRecordIndex();
    int recordCnt = paginationInfo.getRecordCountPerPage();

    // 4. 시작인덱스와 limit 설정
    campaignDTO.setFirstIndex(firstIndex);
    campaignDTO.setRecordCount(recordCnt);

    // 5. 게시글 목록 조회
    log.info("게시글 목록 전달객체 campaignDTO : {}",campaignDTO);
    List<CampaignDetailResponseDTO> campaignList = campaignDAO.selectCampaignList(campaignDTO);

    Map<String, Object> result = new HashMap<>();
    result.put("campaignList", campaignList);
    result.put("paginationInfo", paginationInfo);

    return result;
  }

  @Override
  @Transactional
  public int createCampaign(Map<String, Object> requestDto) {
    // 1. 캠페인 기본 등록
    CampaignDTO campaignDTO = objectMapper.convertValue(requestDto, CampaignDTO.class);

    // 기본값 세팅 (공통코드 서비스 활용)
    if (campaignDTO.getCampaignStatus() == null) {
      campaignDTO.setCampaignStatus(commonService.getDefaultCode("CAM_STA"));
    }
    if (campaignDTO.getRecruitStatus() == null) {
      campaignDTO.setRecruitStatus(commonService.getDefaultCode("REC_STA"));
    }

    campaignDAO.insertCampaign(campaignDTO); // PK 자동생성

    // 2. 유형별 분기 처리
    String type = campaignDTO.getCampaignType();

    if ("CAMP001".equals(type) || "CAMP002".equals(type)) {
      // expDay 리스트 → 문자열 변환
      Object expDayObj = requestDto.get("expDay");
      String expDayStr = "";
      if (expDayObj instanceof List<?> expDayList) {
        expDayStr = String.join("/", expDayList.stream()
                .map(String::valueOf)
                .toArray(String[]::new));
      }
      requestDto.put("expDay", expDayStr);

      // 방문형/포장형
      CampaignVisitDTO visitDTO = objectMapper.convertValue(requestDto, CampaignVisitDTO.class);
      visitDTO.setCampaignIdx(campaignDTO.getCampaignIdx()); // PK 설정

      log.info("방문형/포장형 visitDTO -> {}", visitDTO);
      campaignDAO.insertCampaignVisit(visitDTO);
    } else if ("CAMP003".equals(type) || "CAMP004".equals(type)) {
      // 배송형/구매형
      CampaignDeliveryDTO deliveryDTO = objectMapper.convertValue(requestDto, CampaignDeliveryDTO.class);
      deliveryDTO.setCampaignIdx(campaignDTO.getCampaignIdx()); // PK 설정

      log.info("배송형/구매형 deliveryDTO -> {}", deliveryDTO);
      campaignDAO.insertCampaignDelivery(deliveryDTO);
    }

    // 3. 생성된 캠페인 PK 반환
    return campaignDTO.getCampaignIdx();
  }

    @Override
    @Transactional
    public int updateCampaign(Map<String, Object> requestDto) {
        // 1. 캠페인 기본 정보 수정
        CampaignDTO campaignDTO = objectMapper.convertValue(requestDto, CampaignDTO.class);

        // PK(campaignIdx)는 프론트에서 반드시 넘어와야 함
        if (campaignDTO.getCampaignIdx() == null) {
            throw new IllegalArgumentException("캠페인 ID(campaignIdx)는 필수입니다.");
        }

        // 기본정보 수정 실행
        int updatedRows = campaignDAO.updateCampaign(campaignDTO);
        if (updatedRows == 0) {
            throw new RuntimeException("캠페인 수정에 실패했습니다. (campaignIdx=" + campaignDTO.getCampaignIdx() + ")");
        }

        // 2. 유형별 분기 처리
        String type = campaignDTO.getCampaignType();

        if ("CAMP001".equals(type) || "CAMP002".equals(type)) {
            // expDay 리스트 → 문자열 변환
            Object expDayObj = requestDto.get("expDay");
            String expDayStr = "";
            if (expDayObj instanceof List<?> expDayList) {
                expDayStr = String.join("/", expDayList.stream()
                        .map(String::valueOf)
                        .toArray(String[]::new));
            }
            requestDto.put("expDay", expDayStr);

            // 방문형/포장형 DTO 매핑
            CampaignVisitDTO visitDTO = objectMapper.convertValue(requestDto, CampaignVisitDTO.class);
            visitDTO.setCampaignIdx(campaignDTO.getCampaignIdx());

            log.info("방문형/포장형 updateDTO -> {}", visitDTO);
            campaignDAO.updateCampaignVisit(visitDTO);

        } else if ("CAMP003".equals(type) || "CAMP004".equals(type)) {
            // 배송형/구매형 DTO 매핑
            CampaignDeliveryDTO deliveryDTO = objectMapper.convertValue(requestDto, CampaignDeliveryDTO.class);
            deliveryDTO.setCampaignIdx(campaignDTO.getCampaignIdx());

            log.info("배송형/구매형 updateDTO -> {}", deliveryDTO);
            campaignDAO.updateCampaignDelivery(deliveryDTO);
        }


        // 3. 수정 완료된 캠페인 PK 반환
        return campaignDTO.getCampaignIdx();
    }

    @Override
    @Transactional
    public boolean deleteCampaign(int campaignIdx) {
      int result = campaignDAO.deleteCampaign(campaignIdx);
        return result > 0;
    }

    // 켐페인 상세조회 페이지 로직
  @Override
  public CampaignDetailResponseDTO getDetail(int campaignIdx, Integer memberIdx) {
    CampaignDetailResponseDTO dto = campaignDAO.selectDetailCampaign(campaignIdx, memberIdx);
    if (dto == null) {
      throw new IllegalArgumentException("캠페인을 찾을 수 없습니다. campaignIdx=" + campaignIdx);
    }
    return dto;
  }

  //켐페인 지원신청 페이지
  @Override
  @Transactional(readOnly = true)
  public CampaignApplyDTO getApply(int campaignIdx, Integer memberIdx) {
    if (memberIdx == null) {
      // 인증 안됨
      throw new org.springframework.security.access.AccessDeniedException("로그인이 필요합니다.");
    }

    // SecurityContext에서 권한 확인
    var auth = org.springframework.security.core.context.SecurityContextHolder
        .getContext().getAuthentication();
    boolean isReviewer = auth != null && auth.getAuthorities().stream()
        .anyMatch(a -> "ROLE_USER".equals(a.getAuthority()));

    if (!isReviewer) {
      throw new org.springframework.security.access.AccessDeniedException("리뷰어만 접근 가능합니다.");
    }

    CampaignApplyDTO dto = campaignDAO.selectApply(campaignIdx, memberIdx);
    if (dto == null) throw new IllegalArgumentException("캠페인을 찾을 수 없습니다: " + campaignIdx);
    return dto;
  }

  @Override
  @Transactional
  public CampaignApplicationResponseDTO createApplication(int campaignIdx, int memberIdx, CampaignApplicationRequestDTO campaignApplicationRequestDTO) {

    // 1) 신청 페이지 정보 재사용하여 정책 검증 (모집상태/기간, 배송형, 중복신청, 주소유무)
    CampaignApplyDTO page = campaignDAO.selectApply(campaignIdx, memberIdx);
    if (page == null) {
      throw new IllegalArgumentException("캠페인을 찾을 수 없습니다: " + campaignIdx);
    }
    if (Boolean.FALSE.equals(page.getAllowApply())) {
      throw new IllegalStateException("현재 신청이 불가한 상태/기간입니다.");
    }
    if (Boolean.TRUE.equals(page.getAlreadyApplied())) {
      throw new IllegalStateException("이미 신청한 캠페인입니다.");
    }

    // 2) 배송형이고, 프로필에 주소가 없다면 요청의 주소 필수
    if (Boolean.TRUE.equals(page.getRequireAddress()) && Boolean.FALSE.equals(page.getHasAddress())) {
      if (campaignApplicationRequestDTO.getZipCode() == null || campaignApplicationRequestDTO.getZipCode().trim().isEmpty()
          || campaignApplicationRequestDTO.getAddress() == null || campaignApplicationRequestDTO.getAddress().trim().isEmpty()) {
        throw new IllegalArgumentException("배송형 캠페인은 주소(우편번호/기본주소) 입력이 필요합니다.");
      }

      //  saveAddressToProfile=true면 리뷰어 프로필에 주소 저장/갱신
      if (Boolean.TRUE.equals(campaignApplicationRequestDTO.getSaveAddressToProfile())) {
        int updated = campaignDAO.updateReviewerAddress(
            memberIdx,
            campaignApplicationRequestDTO.getZipCode().trim(),
            campaignApplicationRequestDTO.getAddress().trim(),
            campaignApplicationRequestDTO.getDetailAddress() == null ? null : campaignApplicationRequestDTO.getDetailAddress().trim()
        );
        if (updated == 0) {
          // 프로필이 미리 없을 수 있으면 insert 대비 upsert 메서드를 따로 만들어도 됨
          // 여기서는 update 0이면 예외로 처리(테이블 정책에 맞게 조정)
          throw new IllegalStateException("리뷰어 프로필 주소 저장에 실패했습니다.");
        }
      }
    }

    // 3) 신청 INSERT
    // 상태 코드는 공통코드 테이블(TB_COMMON_CODE.CODE_ID) 기준으로 프로젝트에서 쓰는 기본값을 사용
    // 예시: 'APP_PENDING' 또는 'APP001' 등. 네가 쓰는 코드로 교체
    final String APPLY_STATUS_CODE = "CAMAPP_PENDING";

    int rows = campaignDAO.insertApplication(
        campaignIdx,
        memberIdx,
        campaignApplicationRequestDTO.getApplyReason() == null ? "" : campaignApplicationRequestDTO.getApplyReason().trim(),
        APPLY_STATUS_CODE
    );
    if (rows == 0) throw new IllegalStateException("신청 저장에 실패했습니다.");

    Integer applicationIdx = campaignDAO.lastInsertId(); // - 예시 방금 INSERT한 행의 PK 값 37을 가져옴 프론트로 뿌려줄때 사용하려고
    return new CampaignApplicationResponseDTO(applicationIdx);
  }

  /** 캠페인 신청자 목록 조회 */
    @Override
    @Transactional
    public Map<String, Object> getApplicantsByCampaign(int campaignIdx, int page, String searchCondition, String searchKeyword, String applyStatus) {
        // 1. 전체 레코드 수 조회
        int totalRecord = campaignDAO.countApplicantsByCampaign(campaignIdx, searchCondition, searchKeyword, applyStatus);

        // 2. PaginationInfo 세팅
        PaginationInfo paginationInfo = new PaginationInfo();
        paginationInfo.setCurrentPage(page);
        paginationInfo.setRecordCountPerPage(10); // 페이지당 10개
        paginationInfo.setBlockSize(10);
        paginationInfo.setTotalRecord(totalRecord);

        // 3. 조회 범위 계산
        int firstIndex = paginationInfo.getFirstRecordIndex();
        int recordCount = paginationInfo.getRecordCountPerPage();

        // 4. 목록 조회
        List<OwnerCampaignApplicantResponseDTO> list = campaignDAO.selectApplicantsByCampaign(
                campaignIdx, firstIndex, recordCount, searchCondition, searchKeyword, applyStatus
        );

        // 5. 응답 맵
        Map<String, Object> result = new HashMap<>();
        result.put("applicantList", list);
        result.put("paginationInfo", paginationInfo);

        return result;
    }

  /** 캠페인 신청자 상태 변경 */
  @Override
  @Transactional
  public void changeApplicantStatus(int applicationIdx, String newStatus) {

      // 신청 내역 조회
      OwnerCampaignApplicantResponseDTO applicant = campaignDAO.getApplicantByIdx(applicationIdx);
      if (applicant == null) {
          throw new RuntimeException("신청자를 찾을 수 없습니다. applicationIdx=" + applicationIdx);
      }

      // 모집인원 초과 체크
      if ("CAMAPP_APPROVED".equals(newStatus)) {
          int recruitCount = campaignDAO.getRecruitCountByCampaign(applicant.getCampaignIdx());
          int approvedCount = campaignDAO.getApprovedCountByCampaignForUpdate(applicant.getCampaignIdx());

          if (approvedCount >= recruitCount) {
              throw new RuntimeException("모집인원을 초과할 수 없습니다.");
          }
      }

      int updated = campaignDAO.updateApplicantStatus(applicationIdx, newStatus);
      if (updated == 0) {
          throw new RuntimeException("신청자 상태 변경 실패: applicationIdx=" + applicationIdx);
      }
  }

  // 관리자 캠페인 게시 상태 변경
    @Override
    @Transactional
    public void updateCampaignStatus(CampaignStatusUpdateDTO updateDTO) {
        log.info("Updating campaign status for ID{} to {}", updateDTO.getCampaignIdx(), updateDTO.getStatus());
        int rowsAffected = campaignDAO.updateCampaignStatus(updateDTO.getCampaignIdx(), updateDTO.getStatus());

        if(rowsAffected == 0) {
            log.warn("Failed to update status for campaign ID {}. Campaign not found or no changes mode.", updateDTO.getCampaignIdx());
        } else {
            log.info("Successfully updated status for campaign ID {}.", updateDTO.getCampaignIdx());
        }
    }

    /** 북마크 생성 */
    @Override
    @Transactional
    public boolean addBookmark(int memberIdx, int campaignIdx) {
        try {
            int result = campaignDAO.insertBookmark(memberIdx, campaignIdx);
            return result > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /** 북마크 제거 */
    @Override
    @Transactional
    public boolean removeBookmark(int memberIdx, int campaignIdx) {
        int result = campaignDAO.deleteBookmark(memberIdx, campaignIdx);
        return result > 0;
    }

  @Transactional
  @Override
  public void submitCampaignReview(int campaignId,
      int memberIdx,
      String reviewUrl,
      MultipartFile file) throws Exception {
    Integer appIdx = campaignDAO.findApplicationIdx(campaignId, memberIdx);
    if (appIdx == null) throw new IllegalStateException("승인된 신청자만 리뷰를 등록할 수 있습니다.");
    if (campaignDAO.countReviewByApplication(appIdx) > 0) {
      throw new IllegalStateException("이미 리뷰가 등록되었습니다.");
    }

    // 파일 저장 (파일명만 DB에 저장)
    String fileName = null;
    if (file != null && !file.isEmpty()) {
      fileName = fileStorageService.storeFile(file, "reviewes");
    }

    CampaignReviewDTO dto = new CampaignReviewDTO();
    dto.setApplicationIdx(appIdx);
    dto.setReviewUrl(reviewUrl);
    dto.setImageUrl(fileName); // DB에는 파일명만 저장

    int ins = campaignDAO.insertCampaignReview(dto);
    if (ins != 1) throw new IllegalStateException("리뷰 저장 실패");
  }

  @Override
  public String findApplicationStatus(int campaignId, int memberIdx) {
    // 없으면 null 반환 가능 → 컨트롤러에서 기본 문구로 처리
    return campaignDAO.selectApplicationStatus(campaignId, memberIdx);
  }

    @Override
    @Transactional
    public void completeCampaignSelection(int campaignIdx, int memberIdx) {

        // 1. 캠페인 상세 조회 (작성자 정보 포함)
        CampaignDetailResponseDTO campaign = campaignDAO.selectDetailCampaign(campaignIdx, memberIdx);

        if (campaign == null) {
            throw new IllegalArgumentException("캠페인이 존재하지 않습니다.");
        }

        // 2. 소유권 체크 (로그인한 소상공인과 캠페인 작성자 비교)
        if (campaign.getMemberIdx() != memberIdx) {
            throw new IllegalStateException("권한이 없습니다.");
        }

         // 3. 모집 종료일 체크 (필요하면 활성화)
        // 현재 시간
        LocalDate now = LocalDate.now();
        LocalDate unlockDate = campaign.getApplyEndDate().isAfter(campaign.getAnnounceDate())
                ? campaign.getApplyEndDate()
                : campaign.getAnnounceDate();
        if (unlockDate.isAfter(now)) {
            throw new IllegalStateException("모집 종료 및 발표일 이후에만 선정 완료가 가능합니다.");
        }

        // 4. 단일 캠페인 상태 CLOSED로 업데이트 (전체 마감용 쿼리 아님)
        campaignDAO.updateCampaignStatusToClosed(campaignIdx);

        // 5. 당첨자 조회
        List<Integer> winnerMemberIds = campaignDAO.selectWinnersByCampaignId(campaignIdx);

        // 6. 당첨자 알림 발송
        for (Integer winnerId : winnerMemberIds) {
            NotificationDTO notification = NotificationDTO.builder()
                    .memberIdx(winnerId)
                    .notiTypeCd("CAMPAIGN_RESULT")
                    .notiTitle("[" + campaign.getTitle() + "] 캠페인에 선정완료")
                    .notiMessage("[" + campaign.getTitle() + "] 캠페인에 선정되었습니다.")
                    .notiLinkUrl("/campaign/" + campaignIdx)
                    .build();

            notificationService.createNotification(notification);
        }
    }

    /** 리뷰어 진행 완료 캠페인 */
    @Override
    public Map<String, Object> getCompletedCampaigns(CampaignDTO campaignDTO) {

        int totalRecord = campaignDAO.getCompletedCampaignCount(campaignDTO);

        PaginationInfo paginationInfo = new PaginationInfo();
        paginationInfo.setCurrentPage(campaignDTO.getPage() <= 0 ? 1 : campaignDTO.getPage());
        paginationInfo.setBlockSize(Paging.PAGE_BLOCK_SIZE);
        paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
        paginationInfo.setTotalRecord(totalRecord);

        campaignDTO.setFirstIndex(paginationInfo.getFirstRecordIndex());
        campaignDTO.setRecordCount(paginationInfo.getRecordCountPerPage());

        List<CampaignDetailResponseDTO> completedCampaignList = campaignDAO.getCompletedCampaigns(campaignDTO);
        log.info("조회된 캠페인 수: {}", completedCampaignList.size());
        Map<String, Object> result = new HashMap<>();
        result.put("campaignList", completedCampaignList);
        result.put("paginationInfo", paginationInfo);

        return result;
    }

    /** 리뷰어 진행중 캠페인 */
    @Override
    public Map<String, Object> getOngoingCampaigns(CampaignDTO campaignDTO) {

        int totalRecord = campaignDAO.getOngoingCampaignCount(campaignDTO);

        PaginationInfo paginationInfo = new PaginationInfo();
        paginationInfo.setCurrentPage(campaignDTO.getPage() <= 0 ? 1 : campaignDTO.getPage());
        paginationInfo.setBlockSize(Paging.PAGE_BLOCK_SIZE);
        paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
        paginationInfo.setTotalRecord(totalRecord);

        campaignDTO.setFirstIndex(paginationInfo.getFirstRecordIndex());
        campaignDTO.setRecordCount(paginationInfo.getRecordCountPerPage());

        List<CampaignDetailResponseDTO> onGoingCampaignList = campaignDAO.getOngoingCampaigns(campaignDTO);

        Map<String, Object> result = new HashMap<>();
        result.put("campaignList", onGoingCampaignList);
        result.put("paginationInfo", paginationInfo);

        return result;
    }
}
