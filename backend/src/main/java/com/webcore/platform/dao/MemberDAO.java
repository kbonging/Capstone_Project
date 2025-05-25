package com.webcore.platform.dao;

import com.webcore.platform.domain.MemberAuthDTO;
import com.webcore.platform.domain.MemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberDAO {
    /** 회원 아이디로 정보 조회 */
    // MemberDTO selectMemberById(String memberId);
    /** 로그인 시 정보 조회*/
    MemberDTO selectLoginMemberById(String memberId);
    /** 회원 등록 */
    int insertMember(MemberDTO memberDTO);
    /** 권한 등록 */
    int insertMemberAuth(MemberAuthDTO memberAuthDTO);
}
