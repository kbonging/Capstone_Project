package com.webcore.platform.mypage;

import com.webcore.platform.mypage.dto.MyCampaignDTO;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 내 체험단(My Page) 관련 API 컨트롤러
 * - 내가 신청한 캠페인 목록 조회
 * - 신청 취소 처리
 */
@RestController
@RequestMapping("/api/mypage/my-campaigns")
@RequiredArgsConstructor
public class MyCampaignController {

  // 서비스 레이어 주입 (내 체험단 조회/취소 로직 담당)
  private final MyCampaignService myCampaignService;

  /**
   * [GET] /api/mypage/my-campaigns
   * 내가 신청한 캠페인 목록 조회
   *
   * @param user JWT 인증된 사용자 정보 (CustomUser)
   * @param dto  검색/페이징 조건 (channel, status, q, page 등)
   * @return 캠페인 목록 + 페이지네이션 정보(Map 구조)
   *
   * 동작:
   * 1. 로그인 사용자(memberIdx)를 DTO에 세팅
   * 2. page 값이 0 이하로 들어오면 기본 1페이지로 보정
   * 3. 서비스에서 목록 데이터를 조회하여 반환
   *
   * @ModelAttribute 동작
   * **요청 파라미터(query string, form 데이터)**를 받아서 DTO 객체에 자동으로 바인딩
   */


  @GetMapping
  public Map<String, Object> list(
      @AuthenticationPrincipal CustomUser user,
      @ModelAttribute MyCampaignDTO dto
  ) {
    //  JWT에서 꺼낸 실제 memberIdx 사용 (보안상 프론트에서 임의 조작 불가)
    dto.setMemberIdx(user.getMemberDTO().getMemberIdx());

    // page는 최소 1 이상
    if (dto.getPage() <= 0) dto.setPage(1);

    // 서비스 호출 → {"list": [...], "paginationInfo": {...}} 형태 반환
    return myCampaignService.getMyCampaignList(dto);
  }

  /**
   * [POST] /api/mypage/my-campaigns/{applicationIdx}/cancel
   * 체험단 신청 취소 처리
   *
   * @param user           JWT 인증된 사용자 정보
   * @param applicationIdx 취소할 신청 고유번호
   *
   * 동작:
   * 1. JWT에서 memberIdx 추출
   * 2. 서비스 호출하여 해당 신청 건 취소 처리
   */
  @PostMapping("/{applicationIdx}/cancel")
  public void cancel(
      @AuthenticationPrincipal CustomUser user,
      @PathVariable int applicationIdx
  ) {
    myCampaignService.cancel(user.getMemberDTO().getMemberIdx(), applicationIdx);
  }
}
