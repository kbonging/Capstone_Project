package com.webcore.platform.owner;

import com.webcore.platform.owner.dto.OwnerDTO;
import com.webcore.platform.owner.dto.OwnerReviewCheckListDTO;
import java.util.Map;

public interface OwnerService {
    /** 소상공인 회원 가입 */
    void signupOwner(OwnerDTO ownerDTO);
    /** 회원 고유번호로 소상공인 정보 조회*/
    OwnerDTO selectOwnerByIdx(int memberIdx);

    /** 목록 + totalCount를 Map으로 반환 */
    Map<String, Object> getOwnerReviewList(
        Long campaignId,
        Integer ownerIdFromJwt,
        OwnerReviewCheckListDTO cond // page, recordCount, channelCode, sortDir 포함
    );
}
