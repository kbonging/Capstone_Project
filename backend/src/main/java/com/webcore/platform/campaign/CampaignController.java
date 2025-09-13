package com.webcore.platform.campaign;

import com.webcore.platform.campaign.dto.*;
import com.webcore.platform.file.FileStorageService;
import com.webcore.platform.member.dto.MemberDTO;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignController {

  private final CampaignService campaignService;
  private final FileStorageService fileStorageService;


  /**
   * 공개 캠페인 목록 조회 (메인/체험단 검색)
   */
  @GetMapping("")
  public ResponseEntity<?> getCampaignList(
          CampaignDTO campaignDTO,
          @AuthenticationPrincipal CustomUser customUser) {

      campaignDTO.setOnlyActive("true");

      Map<String, Object> resultMap = campaignService.getCampaignList(campaignDTO);

      log.info("게시글 조회 정보 => {}", resultMap);

      return new ResponseEntity<>(resultMap, HttpStatus.OK);
  }

  /**
   * 소상공인 캠페인 목록 조회
   */
  @GetMapping("/owner")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<?> getOwnerCampaignList(
      CampaignDTO campaignDTO,
      @AuthenticationPrincipal CustomUser customUser) {
    log.info("[GET] /api/campaigns/owner [Request] => {}", campaignDTO);

    campaignDTO.setMemberIdx(customUser.getMemberDTO().getMemberIdx()); // 본인 글만 조회
    campaignDTO.setShowMyParam("true");

    Map<String, Object> resultMap = campaignService.getCampaignList(campaignDTO);
//        log.info("게시글 조회 정보 => {}", resultMap);

    return new ResponseEntity<>(resultMap, HttpStatus.OK);
  }

  /**
   * 관리자 승인/반려용 캠페인 목록 조회
   */
  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> getAdminCampaignsList(
      CampaignDTO campaignDTO,
      @AuthenticationPrincipal CustomUser customUser) {
    log.info("[GET] /api/campaigns/admin [Request]");

    Map<String, Object> resultMap = campaignService.getCampaignList(campaignDTO);

    return new ResponseEntity<>(resultMap, HttpStatus.OK);
  }

  /**
   * 체험단 모집글 등록
   */
  @PostMapping("")
  public ResponseEntity<?> createCampaign(
      @RequestPart("request") Map<String, Object> requestDto,
      @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
      @AuthenticationPrincipal CustomUser customUser) {

    // 1. 로그인 사용자 정보 추가
    requestDto.put("memberIdx", customUser.getMemberDTO().getMemberIdx());

    // 2. 썸네일 업로드 처리
    if (thumbnail != null && !thumbnail.isEmpty()) {
      try {
        String thumbnailUrl = fileStorageService.storeFile(thumbnail, "thumbnails");

        // 업로드 성공 시 경로 추가
        requestDto.put("thumbnailUrl", thumbnailUrl);

      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("에러 발생: " + e.getMessage());
      }
    }
//    log.info("📩 캠페인 등록 요청 데이터 => {}", requestDto);
//    log.info("📎 업로드된 파일 => {}", thumbnail != null ? thumbnail.getOriginalFilename() : "없음");
//    log.info("👤 로그인 사용자 => {}", customUser);

    // 3. 서비스 호출
    int campaignIdx = campaignService.createCampaign(requestDto);

    if (campaignIdx > 0) {
      log.info("Campaign created successfully");
      return new ResponseEntity<>("체험단 모집 글 등록 완료되었습니다.", HttpStatus.OK);
    } else {
      log.info("Campaign creation failed");
      return new ResponseEntity<>("체험단 모집 글 등록 실패했습니다.", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 체험단 모집글 수정
   */
  @PutMapping("/{campaignIdx}")
  public ResponseEntity<?> updateCampaign(
      @PathVariable int campaignIdx,
      @RequestPart("request") Map<String, Object> requestDto,
      @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
      @AuthenticationPrincipal CustomUser customUser) {

    MemberDTO loginMember = customUser.getMemberDTO();
    int loginMemberIdx = loginMember.getMemberIdx();

    // 1. 로그인 사용자 정보 추가
    requestDto.put("memberIdx", loginMemberIdx);
    requestDto.put("campaignIdx", campaignIdx);

    // 기존 게시글 정보 조회
    CampaignDetailResponseDTO originalCampaign = campaignService.getDetail(campaignIdx,
        customUser.getMemberDTO().getMemberIdx());

    // 게시글 존재 여부
    if (originalCampaign == null) {
      return new ResponseEntity<>("켐페인이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }

    boolean isAdmin = loginMember.getAuthDTOList().stream()
        .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuth()));

    // 작성자 또는 관리자만 수정 가능
    if (originalCampaign.getMemberIdx() != loginMemberIdx && !isAdmin) {
      return new ResponseEntity<>("작성자 본인 아님", HttpStatus.FORBIDDEN);
    }

    // 2. 썸네일 업로드 처리 (새 파일이 올라왔을 때만)
    if (thumbnail != null && !thumbnail.isEmpty()) {
      try {
        String thumbnailUrl = fileStorageService.storeFile(thumbnail, "thumbnails");

        // 업로드 성공 시 경로 추가
        requestDto.put("thumbnailUrl", thumbnailUrl);

      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("에러 발생: " + e.getMessage());
      }
    }

    log.info("✏️ 캠페인 수정 요청 데이터 => {}", requestDto);
    log.info("📎 업로드된 파일 => {}", thumbnail != null ? thumbnail.getOriginalFilename() : "없음");
    log.info("👤 로그인 사용자 => {}", customUser);

    // 3. 서비스 호출
    int updated = campaignService.updateCampaign(requestDto);

    if (updated > 0) {
      log.info("Campaign updated successfully");
      return new ResponseEntity<>("체험단 모집 글 수정 완료되었습니다.", HttpStatus.OK);
    } else {
      log.info("Campaign update failed");
      return new ResponseEntity<>("체험단 모집 글 수정 실패했습니다.", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 체험단 모집글 삭제
   */
  @DeleteMapping("/{campaignIdx}")
  public ResponseEntity<?> deleteCampaign(
      @PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser) {

    // 로그인한 사용자 정보
    MemberDTO loginMember = customUser.getMemberDTO();
    int loginMemberIdx = loginMember.getMemberIdx();

    // 게시글 정보 조회
    CampaignDetailResponseDTO originalCampaign = campaignService.getDetail(campaignIdx,
        loginMemberIdx);

    // 게시글 존재 여부
    if (originalCampaign == null) {
      return new ResponseEntity<>("켐페인이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }

    // 관리자 유무
    boolean isAdmin = loginMember.getAuthDTOList().stream()
        .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuth()));

    // 작성자 또는 관리자만 수정 가능
    if (originalCampaign.getMemberIdx() != loginMemberIdx && !isAdmin) {
      return new ResponseEntity<>("작성자 본인 아님", HttpStatus.FORBIDDEN);
    }

    boolean result = campaignService.deleteCampaign(campaignIdx);
    if (result) {
      return new ResponseEntity<>("체험단 모집 글 삭제 완료되었습니다.", HttpStatus.OK);
    }

    return new ResponseEntity<>("체험단 모집 글 삭제 실패했습니다.", HttpStatus.BAD_REQUEST);

  }

  /**
   * 캠페인 상세페이지 조회
   */
  @GetMapping("/{campaignIdx}")
  public ResponseEntity<?> getCampaignDetail(@PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser) {
//        log.info("[GET] /api/campaigns/{}", campaignIdx);

    // 로그인 사용자 memberIdx 추출 (비로그인 접근도 허용할 경우 null 체크 필요)
    Integer memberIdx = null;
    if (customUser != null && customUser.getMemberDTO() != null) {
      memberIdx = customUser.getMemberDTO().getMemberIdx();
    }

    CampaignDetailResponseDTO campaignDetail = campaignService.getDetail(campaignIdx, memberIdx);

    log.info("캠페인 상세 페이지 => {}", campaignDetail);

    return new ResponseEntity<>(campaignDetail, HttpStatus.OK);
  }

  /**
   * 캠페인 지원 페이지 조회
   */
  @PreAuthorize("hasRole('USER')")
  @GetMapping("/{campaignIdx}/apply-page")
  public ResponseEntity<?> getApply(@PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser) {
    Integer memberIdx = customUser.getMemberDTO().getMemberIdx();
    log.info("[apply-page] campaignIdx={}, memberIdx={}", campaignIdx, memberIdx);
    return ResponseEntity.ok(campaignService.getApply(campaignIdx, memberIdx));
  }

  /**
   * 켐페인 신청
   */
  @PreAuthorize("hasRole('USER')")
  @PostMapping("/{campaignIdx}/applications")
  public ResponseEntity<?> createApplication(
      @PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser,
      @RequestBody CampaignApplicationRequestDTO campaignApplicationRequestDTO
  ) {
    Integer memberIdx = customUser.getMemberDTO().getMemberIdx();
    var res = campaignService.createApplication(campaignIdx, memberIdx,
        campaignApplicationRequestDTO);
    return ResponseEntity.ok(res);
  }

  /**
   * 캠페인 신청자 목록 조회
   */
  @GetMapping("/applicants/{campaignIdx}")
  public ResponseEntity<?> getApplicants(
      @PathVariable int campaignIdx,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(required = false) String searchCondition,
      @RequestParam(required = false) String searchKeyword,
      @RequestParam(required = false) String applyStatus) {

    Map<String, Object> result = campaignService.getApplicantsByCampaign(campaignIdx, page,
        searchCondition, searchKeyword, applyStatus);
    return ResponseEntity.ok(result);
  }

  /**
   * 캠페인 신청자 상태 변경
   */
  @PutMapping("/applicants/{applicationIdx}")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<Void> updateApplicantStatus(
      @PathVariable int applicationIdx,
      @RequestBody Map<String, String> request
  ) {
    String newStatus = request.get("status");
    campaignService.changeApplicantStatus(applicationIdx, newStatus);
    return ResponseEntity.ok().build();
  }

  /**
   * 관리자 캠페인 게시 상태 변경
   */
  @PatchMapping("/status")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> updateCampaignStatus(
      @RequestBody CampaignStatusUpdateDTO updateDTO
  ) {
    log.info("[PATCH] /api/campaigns/status 요청");
    try {
      campaignService.updateCampaignStatus(updateDTO);
      return new ResponseEntity<>("캠페인 상태가 성공적으로 변경되었습니다.", HttpStatus.OK);
    } catch (Exception e) {
      log.error("캠페인 상태 변경 실패: {}", e.getMessage());
      return new ResponseEntity<>("캠페인 상태 변경에 실패했습니다.", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 북마크 생성
   */
  @PostMapping("/bookmarks/{campaignIdx}")
  public ResponseEntity<?> addBookmark(
      @PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser
  ) {
    try {
      int memberIdx = customUser.getMemberDTO().getMemberIdx();
      boolean success = campaignService.addBookmark(memberIdx, campaignIdx);

      if (success) {
        return ResponseEntity.ok("북마크가 추가되었습니다.");
      } else {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 찜한 캠페인입니다.");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("북마크 추가 중 오류가 발생했습니다.");
    }
  }

  /**
   * 북마크 삭제
   */
  @DeleteMapping("/bookmarks/{campaignIdx}")
  public ResponseEntity<?> removeBookmark(
      @PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser
  ) {
    try {
      int memberIdx = customUser.getMemberDTO().getMemberIdx();
      boolean success = campaignService.removeBookmark(customUser.getMemberDTO().getMemberIdx(),
          campaignIdx);

      if (success) {
        return ResponseEntity.ok("북마크 해제 완료");
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("찜한 캠페인이 아닙니다.");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("북마크 해제 중 오류가 발생했습니다.");
    }
  }

  @PostMapping("/{campaignId}/reviews")
  public ResponseEntity<?> submitReview(
      @PathVariable int campaignId,
      @RequestParam("reviewUrl") String reviewUrl,
      @RequestParam(value = "file", required = false) MultipartFile file,
      @AuthenticationPrincipal CustomUser user) {
    try {
      campaignService.submitCampaignReview(
          campaignId,
          user.getMemberDTO().getMemberIdx(),
          reviewUrl,
          file
      );
      return ResponseEntity.ok().body("{\"message\":\"ok\"}");
    } catch (IllegalStateException e) {
      String msg = e.getMessage();
      if (msg != null && msg.contains("승인된 신청자만")) {
        // 승인 안 된 리뷰어 → 403 Forbidden
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body("{\"message\":\"" + msg + "\"}");
      }
      if (msg != null && msg.contains("이미 리뷰가 등록되었습니다")) {
        // 중복 등록 → 409 Conflict
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body("{\"message\":\"" + msg + "\"}");
      }
      // 그 외 IllegalStateException → 400 Bad Request
      return ResponseEntity.badRequest()
          .body("{\"message\":\"" + msg + "\"}");
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body("{\"message\":\"" + e.getMessage() + "\"}");
    }
  }




}
