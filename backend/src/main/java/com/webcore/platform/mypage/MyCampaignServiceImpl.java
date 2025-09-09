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

/**
 * '내 체험단' 서비스 구현체
 *
 * 책임:
 * - (조회) 내가 신청한 캠페인 목록을 페이징으로 가져오고,
 *   각 항목에 대해 '취소 가능 여부'와 '표시용 상태(발표 전 마스킹)'를 계산해 반환한다.
 * - (수정) 내 신청 취소(UPDATE). 실패 시 예외를 던진다.
 *
 * 트랜잭션:
 * - 클래스 레벨 @Transactional(readOnly = true): 기본은 읽기 전용
 * - 쓰기 작업(취소)은 메서드 레벨 @Transactional로 별도 선언
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 조회 전용 트랜잭션 (쓰기 메서드에서 재선언)
public class MyCampaignServiceImpl implements MyCampaignService {

  // ===== 신청 상태 코드 (공통코드와 반드시 일치해야 함) =====
  private static final String CODE_PENDING   = "CAMAPP_PENDING";    // 대기
  private static final String CODE_APPROVED  = "CAMAPP_APPROVED";   // 당첨
  private static final String CODE_REJECTED  = "CAMAPP_REJECTED";   // 탈락
  private static final String CODE_CANCELLED = "CAMAPP_CANCELLED";  // 취소

  // ===== 날짜 처리 =====
  private static final ZoneId KST = ZoneId.of("Asia/Seoul");                 // 한국 표준시
  private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // DB 문자열 포맷

  private final MyCampaignDAO myCampaignDAO; // DAO 주입

  /**
   * 내가 신청한 캠페인 목록 조회
   *
   * 단계:
   * 1) 총 레코드 수 조회 → PaginationInfo 계산
   * 2) firstIndex/recordCount를 DTO에 세팅 (LIMIT/OFFSET 용)
   * 3) 목록 조회
   * 4) 후처리
   *    - cancelable 계산:  (취소 아님) && (마감 전 || 발표 전)
   *    - 표시 상태 마스킹: 발표일 전엔 무조건 '대기'로 노출
   *
   * @param dto 검색/페이징 파라미터 (page 등 포함)
   * @return list + paginationInfo 맵
   */
  @Override
  public Map<String, Object> getMyCampaignList(MyCampaignDTO dto) {
    // 1) 총 레코드 수
    int totalRecord = myCampaignDAO.selectMyCampaignCount(dto);

    // 2) 페이지네이션 정보 계산
    PaginationInfo pi = new PaginationInfo();
    pi.setCurrentPage(dto.getPage() <= 0 ? 1 : dto.getPage()); // page가 0 이하이면 1페이지로 보정
    pi.setBlockSize(Paging.PAGE_BLOCK_SIZE);                   // 페이지 블록 크기(예: 10)
    pi.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);         // 페이지당 레코드 수(예: 10)
    pi.setTotalRecord(totalRecord);                            // 전체 레코드 수 세팅 → 내부적으로 first/last index 계산됨

    // LIMIT/OFFSET 세팅: MyBatis 쿼리에서 사용
    dto.setFirstIndex(pi.getFirstRecordIndex());
    dto.setRecordCount(pi.getRecordCountPerPage());

    // 3) 목록 조회
    List<MyCampaignDTO> list = myCampaignDAO.selectMyCampaignList(dto);

    // 4) 후처리 (취소 가능 여부/표시 상태 계산)
    LocalDate today = LocalDate.now(KST); // 오늘(한국 기준)

    for (MyCampaignDTO it : list) {
      // --- (1) 현재 상태가 '취소'가 아닌가?
      boolean notCancelled = !CODE_CANCELLED.equals(it.getApplyStatusCode());

      // --- (2) 마감일 이전인가? (마감 '당일' 포함 → 당일까지 취소 가능)
      boolean beforeDeadline = true; // 마감일이 없으면 제약 없음으로 간주(정책: true)
      try {
        if (it.getApplyEndDate() != null && !it.getApplyEndDate().isBlank()) {
          LocalDate deadline = LocalDate.parse(it.getApplyEndDate(), DATE);
          // today가 deadline을 '지나지' 않았다면(= deadline 이후가 아니라면) true
          beforeDeadline = !today.isAfter(deadline);
        }
      } catch (Exception e) {
        // 날짜 파싱 실패 시 보수적으로 취소 불가 처리
        beforeDeadline = false;
        log.warn("applyEndDate parse failed: appIdx={}, value={}", it.getApplicationIdx(), it.getApplyEndDate(), e);
      }

      // --- (3) 발표일 이전인가? (발표 '당일'은 이미 공개된 것으로 간주 → false)
      boolean beforeAnnounce = false;
      try {
        if (it.getAnnounceDate() != null && !it.getAnnounceDate().isBlank()) {
          LocalDate announce = LocalDate.parse(it.getAnnounceDate(), DATE);
          beforeAnnounce = today.isBefore(announce); // 오늘이 발표일 '전'이면 true
        }
      } catch (Exception e) {
        // 발표일 파싱 실패: 마스킹을 포기하고 원상태로 노출(= beforeAnnounce는 기본 false 유지)
        log.warn("announceDate parse failed: appIdx={}, value={}", it.getApplicationIdx(), it.getAnnounceDate(), e);
      }

      // --- (4) 취소 가능 여부 계산
      // 정책: "취소 아님" && ( "마감 전" || "발표 전" )
      //  - 발표 전에는 실제 상태가 APPROVED/REJECTED라도 취소 허용(요구사항)
      boolean cancelable = notCancelled && (beforeDeadline || beforeAnnounce);
      it.setCancelable(cancelable);

      // --- (5) 표시 상태 마스킹
      // 발표일 이전에는 항상 '대기'로 보이도록 마스킹
      if (beforeAnnounce) {
        it.setDisplayStatusCode(CODE_PENDING);
        it.setDisplayStatusName("대기");
      } else {
        // 발표 이후에는 실제 상태를 그대로 노출
        it.setDisplayStatusCode(it.getApplyStatusCode());
        it.setDisplayStatusName(it.getApplyStatusName());
      }

      // 디버깅이 필요할 때 주석 해제
      // log.info("appIdx={} status={} announce={} end={} -> cancelable={}, display={}",
      //   it.getApplicationIdx(), it.getApplyStatusCode(), it.getAnnounceDate(), it.getApplyEndDate(),
      //   it.getCancelable(), it.getDisplayStatusCode());
    }

    // 5) 응답 묶음
    Map<String, Object> result = new HashMap<>();
    result.put("list", list);
    result.put("paginationInfo", pi);
    return result;
  }

  /**
   * 내 신청 취소 처리
   *
   * 동작:
   * - DAO UPDATE 실행 (WHERE: 내 신청인지, 이미 취소/삭제되지 않았는지 등 조건 포함)
   * - 영향받은 행 수가 0이면 취소 불가 상태로 판단하고 예외 발생
   * ※ 만약 'DEL_YN 방식'을 채택하면 SET DEL_YN='Y'로 바꾸고 상태 조건을 제거하는 식으로 구현 가능
   *
   * 트랜잭션:
   * - 쓰기 작업이므로 메서드 레벨에서 @Transactional로 지정
   */
  @Override
  @Transactional // 쓰기 트랜잭션
  public void cancel(int memberIdx, int applicationIdx) {
    int updated = myCampaignDAO.cancelMyApplication(applicationIdx, memberIdx);
    if (updated == 0) {
      // WHERE 조건에 걸리지 않음: 이미 취소됨 / 내 신청 아님 / 삭제됨 등
      throw new IllegalStateException("취소 불가하거나 이미 취소됨");
    }
  }
}
