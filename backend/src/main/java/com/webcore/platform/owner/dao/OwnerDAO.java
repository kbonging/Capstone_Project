package com.webcore.platform.owner.dao;

import com.webcore.platform.member.dto.MemberUpdateDTO;
import com.webcore.platform.owner.dto.OwnerDTO;
import com.webcore.platform.owner.dto.OwnerReviewCheckListDTO;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface OwnerDAO {
    /** 소상공인 프로필 등록 */
    void insertOwnerProfile(OwnerDTO ownerDTO);
    /** 회원 고유번호로 소상공인 정보 조회*/
    OwnerDTO selectOwnerByIdx(int memberIdx);

    /** 소상공인 프로필 수정 */
    void updateOwnerProfile(MemberUpdateDTO dto);


    // 캠페인 소유자(member_idx) 조회
    Integer selectCampaignOwner(@Param("campaignId") Long campaignId);

    int countOwnerReviews(@Param("campaignId") Long campaignId,
        @Param("channelCode") String channelCode);

    List<OwnerReviewCheckListDTO> selectOwnerReviews(@Param("campaignId") Long campaignId,
        @Param("channelCode") String channelCode,
        @Param("firstIndex") int firstIndex,
        @Param("recordCount") int recordCount,
        @Param("sortDir") String sortDir);
}
