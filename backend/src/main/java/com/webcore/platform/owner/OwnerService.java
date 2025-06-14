package com.webcore.platform.owner;

import com.webcore.platform.owner.dto.OwnerDTO;

public interface OwnerService {
    /** 소상공인 회원 가입 */
    void signupOwner(OwnerDTO ownerDTO);
    /** 회원 고유번호로 소상공인 정보 조회*/
    OwnerDTO selectOwnerByIdx(int memberIdx);
}
