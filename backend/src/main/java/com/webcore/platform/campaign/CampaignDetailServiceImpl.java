package com.webcore.platform.campaign;

import com.webcore.platform.campaign.dao.CampaignDetailDAO;
import com.webcore.platform.campaign.dto.CampaignDetailRes;   // DB 조회용 DTO
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignDetailServiceImpl implements CampaignDetailService {

  private final CampaignDetailDAO dao;

  @Override
  @Transactional(readOnly = true)
  public CampaignDetailRes getDetail(int id, Integer memberId) {
    CampaignDetailRes dto = dao.findDetail(id);
    if (dto == null) {
      throw new IllegalArgumentException("캠페인을 찾을 수 없습니다. id=" + id);
    }

    // 캠페인 타입별 부가 정보 주입
    if ("CAMP001".equals(dto.getCampaignType())) {
      dto.setVisitInfo(dao.findVisit(id));
    } else if ("CAMP003".equals(dto.getCampaignType())) {
      dto.setDeliveryInfo(dao.findDelivery(id));
    }

    // 지원자 수(있으면 집계), 조회수는 제거
    dto.setApplicants(dao.countApplicants(id));

    // dates 묶음 생성
    dto.bindDates();

    return dto;
  }
}
