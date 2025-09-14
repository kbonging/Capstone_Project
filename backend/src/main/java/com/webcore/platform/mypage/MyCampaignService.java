package com.webcore.platform.mypage;

import com.webcore.platform.mypage.dto.BookmarkDTO;
import com.webcore.platform.mypage.dto.MyCampaignDTO;

import java.util.Map;

public interface MyCampaignService {
  Map<String, Object> getMyCampaignList(MyCampaignDTO dto);
  void cancel(int memberIdx, int applicationIdx);

  /** 멤버 북마크 전체 조회 */
  Map<String, Object> getBookmarkList(BookmarkDTO bookmarkDTO);
}

