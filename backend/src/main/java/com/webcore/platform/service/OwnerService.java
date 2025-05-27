package com.webcore.platform.service;

import com.webcore.platform.domain.OwnerDTO;

public interface OwnerService {
    /** 소상공인 회원 가입 */
    void signupOwner(OwnerDTO ownerDTO);
}
