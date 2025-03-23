package com.vibeStay.platform.dao;

import com.vibeStay.platform.domain.MemberAuthDTO;
import com.vibeStay.platform.domain.MemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberDAO {
    /** 회원 아이디로 정보 조회 */
    MemberDTO selectMemberById(String memberId);
    /** 회원 등록 */
    int insertMember(MemberDTO memberDTO);
    /** 권한 등록 */
    int insertMemberAuth(MemberAuthDTO memberAuthDTO);
}
