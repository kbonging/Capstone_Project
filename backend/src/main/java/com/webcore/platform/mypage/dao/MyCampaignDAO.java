package com.webcore.platform.mypage.dao;

import com.webcore.platform.mypage.dto.MyCampaignDTO;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MyCampaignDAO {

  int selectMyCampaignCount(MyCampaignDTO cond);
  List<MyCampaignDTO> selectMyCampaignList(MyCampaignDTO cond);
  int cancelMyApplication(int applicationIdx, int memberIdx);

}
