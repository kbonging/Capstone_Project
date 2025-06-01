package com.webcore.platform.dao;

import com.webcore.platform.domain.OwnerDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OwnerDAO {
    /** 소상공인 프로필 등록 */
    void insertOwnerProfile(OwnerDTO ownerDTO);
    /** 회원 고유번호로 소상공인 정보 조회*/
    OwnerDTO selectOwnerByIdx(int memberIdx);
}
