package com.webcore.platform.member;

import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.member.dto.MemberUpdateDTO;

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

    /** memberIdx로 권한 확인 */
    List<MemberAuthDTO> getAuthListByMemberIdx(int memberIdx);

    /** 아이디 중복 체크*/
    boolean checkDuplicateId(String memberId);

    /** 이메일 중복 체크*/
    boolean isEmailExists(String memberEmail);

    /** 회원 정보 수정 */
    void updateMember(MemberUpdateDTO memberUpdateDTO, String role);

    /** 회원 탈퇴 */
    void deleteMember(int memberIdx);
}
