package com.webcore.platform.dao;

import com.webcore.platform.domain.MemberAuthDTO;
import com.webcore.platform.domain.MemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberDAO {
    /** 로그인 시 정보 조회*/
    MemberDTO selectLoginMemberById(String memberId);
    /** 회원 등록 */
    int insertMember(MemberDTO memberDTO);
    /** 권한 등록 */
    int insertMemberAuth(MemberAuthDTO memberAuthDTO);
    /** 회원 고유번호로 정보 조회 */
    MemberDTO selectMemberByIdx(int memberIdx);
    /** 아이디 중복 체크 */
    int countByMemberId(String memberId);
}
