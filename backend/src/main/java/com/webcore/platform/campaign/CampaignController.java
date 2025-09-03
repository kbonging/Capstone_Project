package com.webcore.platform.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.file.FileStorageService;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignController {
  private final CampaignService campaignService;
  private final FileStorageService fileStorageService;
  
  /** 체험단 모집글 등록 */
  @PostMapping("")
  public ResponseEntity<?> createCampaign(
          @RequestPart("request") Map<String, Object> requestDto,
          @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
          @AuthenticationPrincipal CustomUser customUser){

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
    log.info("📩 캠페인 등록 요청 데이터 => {}", requestDto);
    log.info("📎 업로드된 파일 => {}", thumbnail != null ? thumbnail.getOriginalFilename() : "없음");
    log.info("👤 로그인 사용자 => {}", customUser);

    // 3. 서비스 호출
    int campaignIdx = campaignService.createCampaign(requestDto);

    if(campaignIdx > 0){
      log.info("Campaign created successfully");
      return new ResponseEntity<>("체험단 모집 글 등록 완료되었습니다.", HttpStatus.OK);
    }else {
      log.info("Campaign creation failed");
      return new ResponseEntity<>("체험단 모집 글 등록 실패했습니다.", HttpStatus.BAD_REQUEST);
    }
  }

  /** 캠페인 상세페이지 조회 */
  @GetMapping("/{campaignIdx}")
  public ResponseEntity<?> getCampaignDetail(@PathVariable int campaignIdx,
      @AuthenticationPrincipal CustomUser customUser) {
    log.info("[GET] /api/campaigns/{}", campaignIdx);

    // 로그인 사용자 memberIdx 추출 (비로그인 접근도 허용할 경우 null 체크 필요)
    Integer memberIdx = null;
    if (customUser != null && customUser.getMemberDTO() != null) {
      memberIdx = customUser.getMemberDTO().getMemberIdx();
    }

    CampaignDetailResponseDTO campaignDetail = campaignService.getDetail(campaignIdx, memberIdx);

    log.info("캠페인 상세 페이지 => {}", campaignDetail);

    return new ResponseEntity<>(campaignDetail, HttpStatus.OK);
  }
}
