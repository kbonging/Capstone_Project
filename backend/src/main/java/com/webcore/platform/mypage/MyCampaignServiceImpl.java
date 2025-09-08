package com.webcore.platform.mypage;

import com.webcore.platform.common.PaginationInfo;
import com.webcore.platform.constants.Paging;
import com.webcore.platform.mypage.dao.MyCampaignDAO;
import com.webcore.platform.mypage.dto.MyCampaignDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyCampaignServiceImpl implements MyCampaignService {

  // === 상태 코드 상수 정의 ===
  private static final String CODE_PENDING   = "CAMAPP_PENDING";   // 대기(신청 상태)
  private static final String CODE_APPROVED  = "CAMAPP_APPROVED";  // 당첨
  private static final String CODE_CANCELLED = "CAMAPP_CANCELLED"; // 취소됨

  // === 날짜/시간 처리용 상수 ===
  private static final ZoneId  KST  = ZoneId.of("Asia/Seoul");           // 한국 표준시
  private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // 날짜 포맷

  private final MyCampaignDAO myCampaignDAO;

  /**
   * 내가 신청한 캠페인 목록 조회
   * - 페이징 처리
   * - 서비스 후처리(cancelable 계산)
   */
  @Override
  public Map<String, Object> getMyCampaignList(MyCampaignDTO dto) {
    // 전체 레코드 수 조회
    int totalRecord = myCampaignDAO.selectMyCampaignCount(dto);

    // 페이지네이션 객체 생성
    PaginationInfo pi = new PaginationInfo();
    pi.setCurrentPage(dto.getPage() <= 0 ? 1 : dto.getPage()); // page <= 0 이면 1페이지로 보정
    pi.setBlockSize(Paging.PAGE_BLOCK_SIZE);                   // 페이지 블록 크기 (예: 10)
    pi.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);         // 페이지당 레코드 수 (예: 10)
    pi.setTotalRecord(totalRecord);                            // 전체 건수 세팅

    // DAO 조회용 offset/limit 세팅
    dto.setFirstIndex(pi.getFirstRecordIndex());
    dto.setRecordCount(pi.getRecordCountPerPage());

    // DB에서 내 캠페인 목록 조회
    List<MyCampaignDTO> list = myCampaignDAO.selectMyCampaignList(dto);

    // === 서비스 후처리: cancelable 여부 계산 ===
    LocalDate today = LocalDate.now(KST);
    for (MyCampaignDTO it : list) {
      boolean pending      = CODE_PENDING.equals(it.getApplyStatusCode());    // 대기 상태인지
      boolean notCancelled = !CODE_CANCELLED.equals(it.getApplyStatusCode()); // 이미 취소된 건 아닌지
      boolean notApproved  = !CODE_APPROVED.equals(it.getApplyStatusCode());  // 이미 당첨된 건 아닌지

      boolean beforeDeadline = true; // 기본값 = 취소 가능
      try {
        if (it.getApplyEndDate() != null && !it.getApplyEndDate().isBlank()) {
          LocalDate deadline = LocalDate.parse(it.getApplyEndDate(), DATE);
          // 정책: 오늘 포함해서 마감일을 지나지 않았다면 취소 가능
          beforeDeadline = !today.isAfter(deadline);
        }
      } catch (Exception e) {
        // 날짜 파싱 실패 → 보수적으로 취소 불가 처리
        beforeDeadline = false;
        log.warn("applyEndDate parse failed: idx={}, value={}", it.getApplicationIdx(), it.getApplyEndDate(), e);
      }

      // 최종 취소 가능 조건: 대기 상태 && 아직 당첨/취소 아님 && 마감일 전
      boolean cancelable = pending && notApproved && notCancelled && beforeDeadline;
      it.setCancelable(cancelable);
    }

    // 결과 맵 구성 (목록 + 페이지네이션 정보)
    Map<String, Object> result = new HashMap<>();
    result.put("list", list);
    result.put("paginationInfo", pi);
    return result;
  }

  /**
   * 내 신청 취소 처리
   * - DB update로 상태 변경
   * -나중에 공통코드 취소상태 만들어서 작업하면 좋을거 같음
   */
  @Override
  @Transactional
  public void cancel(int memberIdx, int applicationIdx) {
    // DAO 호출 → applicationIdx, memberIdx 일치하는 건만 update
    int updated = myCampaignDAO.cancelMyApplication(applicationIdx, memberIdx);

    // 업데이트된 행이 0개면 (조건 불일치/이미 취소됨) 예외 발생
    if (updated == 0) throw new IllegalStateException("취소 불가하거나 이미 취소됨");
  }
}
