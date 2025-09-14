package com.webcore.platform.mypage;

import com.webcore.platform.common.PaginationInfo;
import com.webcore.platform.constants.Paging;
import com.webcore.platform.mypage.dao.MyCampaignDAO;
import com.webcore.platform.mypage.dto.BookmarkDTO;
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
@Transactional(readOnly = true)        // 기본은 읽기 전용 트랜잭션 (조회용)
public class MyCampaignServiceImpl implements MyCampaignService {

  // ===== 상태 코드 상수 정의 =====
  private static final String CODE_PENDING   = "CAMAPP_PENDING";    // 대기
  private static final String CODE_APPROVED  = "CAMAPP_APPROVED";   // 승인
  private static final String CODE_REJECTED  = "CAMAPP_REJECTED";   // 거절
  private static final String CODE_CANCELLED = "CAMAPP_CANCELLED";  // 취소

  // ===== 날짜/시간 관련 상수 =====
  private static final ZoneId KST = ZoneId.of("Asia/Seoul");                 // 한국 시간대
  private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // 날짜 포맷

  // DAO 의존성 (생성자 주입됨)
  private final MyCampaignDAO myCampaignDAO;

  /**
   * 내가 신청한 캠페인 목록 조회 + 페이징 처리
   * - 각 항목마다 '취소 가능 여부'와 '발표 전 상태 마스킹'을 계산
   */
  @Override
  public Map<String, Object> getMyCampaignList(MyCampaignDTO dto) {
    // 1) 전체 레코드 수 조회
    int totalRecord = myCampaignDAO.selectMyCampaignCount(dto);

    // 2) 페이지네이션 정보 생성 및 설정
    PaginationInfo pi = new PaginationInfo();
    pi.setCurrentPage(dto.getPage() <= 0 ? 1 : dto.getPage());  // 현재 페이지 (기본값 1)
    pi.setBlockSize(Paging.PAGE_BLOCK_SIZE);                    // 한 번에 보여줄 페이지 블록 수
    pi.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);          // 한 페이지당 레코드 수
    pi.setTotalRecord(totalRecord);                             // 전체 레코드 수 세팅

    // 3) 조회용 DTO에 limit/offset 값 반영
    dto.setFirstIndex(pi.getFirstRecordIndex());  // SQL 시작 index
    dto.setRecordCount(pi.getRecordCountPerPage());// SQL limit 수

    // 4) 목록 조회
    List<MyCampaignDTO> list = myCampaignDAO.selectMyCampaignList(dto);

    // 오늘 날짜 (KST 기준)
    LocalDate today = LocalDate.now(KST);

    // 5) 각 항목에 대해 취소 가능 여부 + 상태 표시 가공
    for (MyCampaignDTO it : list) {
      // (A) 취소 가능 여부 계산
      // 이미 취소된 상태가 아니면 취소 가능
      boolean notCancelled = !CODE_CANCELLED.equals(it.getApplyStatusCode());
      boolean cancelable = notCancelled;
      it.setCancelable(cancelable);

      // (B) 발표일 전이면 상태를 마스킹
      boolean beforeAnnounce = false;
      try {
        // announceDate가 존재하면 파싱 후 오늘과 비교
        if (it.getAnnounceDate() != null && !it.getAnnounceDate().isBlank()) {
          LocalDate announce = LocalDate.parse(it.getAnnounceDate(), DATE);
          beforeAnnounce = today.isBefore(announce);
        }
      } catch (Exception e) {
        // 날짜 파싱 실패 시 경고 로그 출력
        log.warn("announceDate parse failed: appIdx={}, value={}",
            it.getApplicationIdx(), it.getAnnounceDate(), e);
      }

      // 발표 전이면 '대기' 상태로 강제 표시
      if (beforeAnnounce) {
        it.setDisplayStatusCode(CODE_PENDING);
        it.setDisplayStatusName("대기");
      } else {
        // 발표일 이후라면 원래 상태 그대로 표시
        it.setDisplayStatusCode(it.getApplyStatusCode());
        it.setDisplayStatusName(it.getApplyStatusName());
      }
    }

    // 6) 결과 맵 구성 (목록 + 페이지 정보)
    Map<String, Object> result = new HashMap<>();
    result.put("list", list);
    result.put("paginationInfo", pi);
    return result;
  }

  /**
   * 내 신청 취소 처리
   * - DAO에서 update 수행
   * - 실패(영향 받은 row 없음) 시 예외 발생
   */
  @Override
  @Transactional   // 쓰기 작업이므로 별도 트랜잭션
  public void cancel(int memberIdx, int applicationIdx) {
    int updated = myCampaignDAO.cancelMyApplication(applicationIdx, memberIdx);

    // 업데이트된 행이 없다면 취소 불가 → 예외 발생
    if (updated == 0) {
      throw new IllegalStateException("취소 불가하거나 이미 취소됨");
    }
  }

  /** 멤버 북마크 전체 조회 */
  public Map<String, Object> getBookmarkList(BookmarkDTO bookmarkDTO) {
    int totalRecord = myCampaignDAO.selectBookmarkCount(bookmarkDTO);

    PaginationInfo paginationInfo = new PaginationInfo();
    paginationInfo.setCurrentPage(bookmarkDTO.getPage() <= 0 ? 1 : bookmarkDTO.getPage());
    paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
    paginationInfo.setBlockSize(Paging.RECORDS_PER_PAGE);
    paginationInfo.setTotalRecord(totalRecord);

    bookmarkDTO.setFirstIndex(paginationInfo.getFirstRecordIndex());
    bookmarkDTO.setRecordCount(paginationInfo.getRecordCountPerPage());

    List<BookmarkDTO> bookmarkList = myCampaignDAO.selectMyBookmark(bookmarkDTO);

    Map<String, Object> result = new HashMap<>();
    result.put("bookmarkList", bookmarkList);
    result.put("paginationInfo", paginationInfo);

    return result;

  }
}
