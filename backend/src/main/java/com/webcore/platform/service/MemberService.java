package com.webcore.platform.service;

import com.webcore.platform.domain.MemberAuthDTO;
import com.webcore.platform.domain.MemberDTO;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface MemberService {
    /**
     * 회원의 고유번호와 권한 정보를 기반으로,
     * 해당 회원의 역할(리뷰어, 소상공인 등)에 맞는 상세 프로필 정보를 조회합니다.
     *
     * @param memberIdx  회원 고유 식별자 (PK)
     * @param authList   회원의 권한 목록
     * @return           역할에 따른 도메인 DTO (ReviewerDTO, OwnerDTO 등)
     */
    Object loadUserInfoByMemberIdx(int memberIdx, List<MemberAuthDTO> authList);

    /** 아이디 중복 체크*/
    boolean checkDuplicateId(String memberId);
}
