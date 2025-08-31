package com.webcore.platform.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.campaign.dto.CampaignDeliveryDTO;
import com.webcore.platform.campaign.dto.CampaignDetailResponseDTO;
import com.webcore.platform.campaign.dto.CampaignVisitDTO;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignController {
  private final ObjectMapper objectMapper;
  private final CampaignService campaignService;
  
  /** 체험단 모집글 등록 */
  @PostMapping("")
  public ResponseEntity<?> createCampaign(@RequestBody Map<String, Object> payload,
                                          @AuthenticationPrincipal CustomUser customUser){
    log.info("체험단 모집 등록 Map =>{}", payload);
    log.info("USER(소상공인) 정보 : {}", customUser);

    String type = (String) payload.get("campaignType");

    if ("CAMP001".equals(type) || "CAMP002".equals(type)) {
      // 방문형/포장형 DTO 변환
      CampaignVisitDTO visitDTO = objectMapper.convertValue(payload, CampaignVisitDTO.class);
      log.info("방문형/포장형 visitDTO -> {}", visitDTO);
//      campaignService.createCampaignVisit(visitDTO, user.getUsername());

    } else {
      // 배송형/구매형 DTO 변환
      CampaignDeliveryDTO deliveryDTO = objectMapper.convertValue(payload, CampaignDeliveryDTO.class);
      log.info("배송형/구매형 deliveryDTO -> {}", deliveryDTO);
//      campaignService.createCampaignDelivery(deliveryDTO, user.getUsername());
    }
    return new ResponseEntity<>("체험단 모집글 등록 완료되었습니다.", HttpStatus.OK);
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
